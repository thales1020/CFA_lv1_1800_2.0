import json
import re

def fix_dollar_signs(text):
    """Fix dollar sign issues in text."""
    if not text:
        return text
    
    # Fix: $profit/loss$ -> profit/loss (these should not be in math mode)
    text = text.replace('$profit/loss$', 'profit/loss')
    
    # Fix: $80=100 at the beginning of a formula -> wrap properly
    # Pattern: $(equation also shown as $80=100/(1+r)$^{20}$
    # Should be: (equation also shown as $80=100/(1+r)^{20}$)
    text = re.sub(r'\$\(equation also shown as \$(\d+)=', r'(equation also shown as $\1=', text)
    
    # Fix: shown as 80 $100/(1+r)^{20}$.$ -> shown as $80=100/(1+r)^{20}$.)
    text = re.sub(r'shown as (\d+) \$(\d+)/\(1\+r\)\^\{(\d+)\}\.\$', r'shown as $\1=\2/(1+r)^{\3}$)', text)
    
    # Fix broken formulas like: $90=100/(1+Z_{12})^{12} 100/90=(1+Z_{12})^{12}$
    # This should be: $90=100/(1+Z_{12})^{12}$, $100/90=(1+Z_{12})^{12}$
    text = re.sub(r'(\$\d+=.+?\^\{\d+\})\s+(\d+/.+=.+?\^\{\d+\}\$)', r'\1$, $\2', text)
    
    # Fix: shown as $80=100/(1+r)$^{20}$ -> shown as $80=100/(1+r)^{20}$)
    text = re.sub(r'\$(\d+)=(\d+)/\(1\+r\)\$\^\{(\d+)\}\$', r'$\1=\2/(1+r)^{\3}$)', text)
    
    # Fix: Z=00.0882 -> Z=0.00882 (double zero issue)
    text = re.sub(r'([A-Z])=00\.0(\d+)', r'\1=0.00\2', text)
    text = re.sub(r'([A-Z]_\{\d+\})=00\.0(\d+)', r'\1=0.00\2', text)
    text = re.sub(r'([A-Z]_\{\d+\})=00\.(\d+)', r'\1=0.0\2', text)
    
    # Fix: Z=0.00882. -> Z=0.00882 (remove period after number in formulas)
    text = re.sub(r'([A-Z]=0\.\d+)\.', r'\1', text)
    
    # Fix: Year $1125$ -> Year 1: $125 (was incorrectly parsed)
    text = re.sub(r'Year \$(\d)(\d{3})\$', r'Year \1: $\2', text)
    
    # Fix: -$10 million 20% -> -$10 million × 20%
    text = re.sub(r'million (\d+%)', r'million × \1', text)
    text = re.sub(r'billion (\d+%)', r'billion × \1', text)
    
    # Fix currency amounts that got escaped: \\$43 should stay as $43 in regular text
    # But in formulas keep them
    
    # Fix: $(0.10-0.02)$=0.$11/0$.08 -> $(0.10-0.02)=0.11/0.08$
    text = re.sub(r'\$\(([0-9.+-]+)\)\$=(\d+)\.\$(\d+)/(\d+)\$\.(\d+)', r'$(\1)=\2.\3/\4.\5$', text)
    
    # Fix: [X-F$(T)/(1+r)$] -> $[X-F(T)/(1+r)]$
    text = re.sub(r'\[X-F\$\(T\)/\(1\+r\)\$\]', r'$[X-F(T)/(1+r)]$', text)
    
    # Fix: $(cash equivalents... )$ -> (cash equivalents...) - not a formula
    text = re.sub(r'\$\(cash equivalents and short-term investments\)\$', r'(cash equivalents and short-term investments)', text)
    
    # Fix: 0.$11/0$.08 -> 0.11/0.08
    text = re.sub(r'(\d+)\.\$(\d+)/(\d+)\$\.(\d+)', r'\1.\2/\3.\4', text)
    
    # Fix wrapped text that shouldn't be in math mode
    # $2.5+4.5+2.2=9.2$ at the end is OK
    # But things like: this amount $\times$ 20% should be: this amount × 20%
    # Actually \times inside text is OK, the issue is stand-alone $ around \times
    
    # Fix \\\\$ (quadruple backslash) to \\$ (double backslash for JSON)
    text = re.sub(r'\\\\\\\\\\$', r'\\\\$', text)
    
    # Fix: $90=100/(1+Z_{12})^{12}. -> $90=100/(1+Z_{12})^{12}$.
    # Remove periods inside formulas before closing $
    text = re.sub(r'\.\$', r'$', text)
    
    return text

def process_json_file(input_file, output_file):
    print(f"Reading {input_file}...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Processing {len(data)} questions...")
    
    for i, question in enumerate(data, 1):
        if i % 10 == 0:
            print(f"  Processed {i}/{len(data)} questions...")
        
        # Fix all text fields
        for field in ['question_text', 'option_a', 'option_b', 'option_c', 
                      'explanation_a', 'explanation_b', 'explanation_c']:
            if field in question and question[field]:
                question[field] = fix_dollar_signs(question[field])
    
    print(f"Writing to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Done!")

if __name__ == "__main__":
    input_file = r"c:\github\she\CFA_lv1_1800_2.0\data\mock1_section2_cleaned.json"
    output_file = r"c:\github\she\CFA_lv1_1800_2.0\data\mock1_section2_fixed.json"
    
    process_json_file(input_file, output_file)
