import json
import re
from typing import Dict, List, Any

def fix_dollar_brackets(text: str) -> str:
    """Fix $[25] to $25 and similar patterns."""
    if not text:
        return text
    
    # Remove brackets after dollar signs: $[25] -> $25
    text = re.sub(r'\$\[(\d+(?:\.\d+)?)\]', r'$\1', text)
    # Remove brackets around amounts: [$3 million] -> $3 million
    text = re.sub(r'\[(\$\d+(?:\.\d+)?)\s*(million|billion|thousand)?\]', r'\1 \2', text)
    # Fix standalone bracketed numbers
    text = re.sub(r'\[(\$?\d+(?:\.\d+)?)\]', r'\1', text)
    
    return text

def fix_tilde_and_approx(text: str) -> str:
    """Fix tilde symbols used for approximation."""
    if not text:
        return text
    
    # Fix ~2.7% to ≈ 2.7% or just space
    # In financial context, ~ is often approximation
    text = re.sub(r'\^?\{?\\sim\}?', r' \\approx ', text)
    text = re.sub(r'~', r' \\approx ', text)
    text = re.sub(r'\\gamma', ' ', text)  # Sometimes gamma is mistakenly used
    
    return text

def fix_missing_spaces(text: str) -> str:
    """Fix concatenated words by adding spaces where needed."""
    if not text:
        return text
    
    # Fix specific common concatenations first
    text = re.sub(r'therefore([A-Z])', r'Therefore \1', text)
    text = re.sub(r'however([A-Z])', r'However \1', text)
    text = re.sub(r'million([A-Z])', r'million \1', text)
    
    # Fix percentage patterns - but NOT when it's a valid percentage like "20%"
    # Only add multiplication when a word is directly attached to percentage
    text = re.sub(r'([a-z]+)(\d+%)', r'\1 × \2', text)
    
    # Fix missing spaces after numbers followed by "million" or "billion"
    text = re.sub(r'(\d+)(million|billion)', r'\1 \2', text, flags=re.IGNORECASE)
    
    # Number followed by lowercase word (but not part of valid number format)
    text = re.sub(r'(\d)([a-z]{4,})', r'\1 \2', text)
    
    # Common financial terms - only fix if actually concatenated
    financial_patterns = [
        (r'(\w)(million)([A-Z])', r'\1 \2 \3'),
        (r'(\w)(billion)([A-Z])', r'\1 \2 \3'),
        (r'(year)([A-Z])', r'\1 \2'),
        (r'(Year)([A-Z])', r'\1 \2'),
        (r'(profit)([a-z]{3,})', r'\1 \2'),
        (r'(loss)([a-z]{3,})', r'\1 \2'),
        (r'(price)([a-z]{3,})', r'\1 \2'),
        (r'(rate)([a-z]{3,})', r'\1 \2'),
        (r'(value)([a-z]{3,})', r'\1 \2'),
        (r'(market)([a-z]{3,})', r'\1 \2'),
        (r'(bond)([a-z]{3,})', r'\1 \2'),
        (r'(fund)([a-z]{3,})', r'\1 \2'),
        (r'(asset)([a-z]{3,})', r'\1 \2'),
        (r'(stock)([a-z]{3,})', r'\1 \2'),
        (r'(company)([a-z]{3,})', r'\1 \2'),
        (r'(investment)([a-z]{3,})', r'\1 \2'),
        (r'(return)([a-z]{3,})', r'\1 \2'),
        (r'(capital)([a-z]{3,})', r'\1 \2'),
        (r'(risk)([a-z]{3,})', r'\1 \2'),
        (r'(portfolio)([a-z]{3,})', r'\1 \2'),
        (r'(dividend)([a-z]{3,})', r'\1 \2'),
        (r'(coupon)([a-z]{3,})', r'\1 \2'),
        (r'(maturity)([a-z]{3,})', r'\1 \2'),
        (r'(option)([a-z]{3,})', r'\1 \2'),
        (r'(forward)([a-z]{3,})', r'\1 \2'),
        (r'(swap)([a-z]{3,})', r'\1 \2'),
        (r'(derivative)([a-z]{3,})', r'\1 \2'),
        (r'(security)([a-z]{3,})', r'\1 \2'),
        (r'(equity)([a-z]{3,})', r'\1 \2'),
        (r'(interest)([a-z]{3,})', r'\1 \2'),
        (r'(yield)([a-z]{3,})', r'\1 \2'),
        (r'(duration)([a-z]{3,})', r'\1 \2'),
    ]
    
    for pattern, replacement in financial_patterns:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    # Common words - be more conservative
    common_patterns = [
        (r'(the)([A-Z])', r'\1 \2'),
        (r'(and)([A-Z])', r'\1 \2'),
        (r'(for)([A-Z])', r'\1 \2'),
        (r'(with)([A-Z])', r'\1 \2'),
        (r'(from)([A-Z])', r'\1 \2'),
        (r'(that)([A-Z])', r'\1 \2'),
        (r'(this)([A-Z])', r'\1 \2'),
        (r'(therefore)([A-Z])', r'\1 \2'),
        (r'(because)([A-Z])', r'\1 \2'),
        (r'(between)([A-Z])', r'\1 \2'),
    ]
    
    for pattern, replacement in common_patterns:
        text = re.sub(pattern, replacement, text)
    
    return text

def fix_latex_commands(text: str) -> str:
    """Fix broken LaTeX commands by adding missing backslashes."""
    if not text:
        return text
    
    # Fix already escaped but wrong number of backslashes
    # In JSON, we need \\ to represent a single \
    # But sometimes we have \\\\ (4) which represents \\ in the actual string
    
    # First, normalize: if we have single backslash before latex command, make it double
    latex_commands = [
        'times', 'div', 'frac', 'sqrt', 'sum', 'prod', 'int',
        'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'theta', 'lambda', 'mu', 'sigma', 'pi',
        'leq', 'geq', 'neq', 'approx', 'sim', 'equiv',
        'infty', 'partial', 'nabla', 'cdot',
        'left', 'right', 'big', 'Big',
    ]
    
    # Fix quadruple backslashes to double (for JSON encoding)
    for cmd in latex_commands:
        text = re.sub(r'\\\\\\\\' + cmd, r'\\\\' + cmd, text)
    
    # Fix standalone latex commands (not already escaped)
    for cmd in latex_commands:
        # Match the command when it's not already preceded by backslash
        pattern = r'(?<!\\)(?<![a-zA-Z])\b' + cmd + r'\b(?![a-zA-Z])'
        replacement = '\\\\' + cmd  # Double backslash for JSON
        text = re.sub(pattern, replacement, text)
    
    return text

def wrap_math_expressions(text: str) -> str:
    """Wrap mathematical expressions in $ delimiters."""
    if not text:
        return text
    
    # Patterns that should be wrapped in math mode
    # Be careful not to double-wrap things already in $...$
    
    def is_in_math_mode(text: str, pos: int) -> bool:
        """Check if position is already inside $ ... $"""
        # Count dollars before this position
        # But skip escaped dollars (<<<DOLLAR>>>)
        before = text[:pos]
        # Remove placeholders before counting
        before_no_placeholder = before.replace('<<<DOLLAR>>>', '')
        before_no_escaped = before_no_placeholder.replace('\\\\$', '')
        dollars_before = before_no_escaped.count('$')
        # Odd number means we're inside math mode
        return dollars_before % 2 == 1
    
    # Match various math patterns
    patterns_to_wrap = [
        # Equations with = and variables (e.g., Z_{12}=0.00882)
        r'([A-Za-z_]\{[^}]+\}\s*=\s*[0-9\.\-]+)',
        # Variables with subscripts: X_{12}
        r'([A-Za-z]+_\{[^}]+\})',
        # Variables with superscripts in parentheses: (1+r)^{20}
        r'(\([^\)]+\)\^\{[^}]+\})',
        # Standalone superscripts
        r'([A-Za-z0-9]+\^\{[^}]+\})',
        # LaTeX commands (e.g., \times, \alpha, \sigma)
        r'(\\[a-z]+(?:\{[^}]*\})?)',
        # Fractions with /: (X+Y)/(1+Z)
        r'(\([^)]+\)/\([^)]+\))',
        r'([A-Za-z_0-9\{\}]+/[A-Za-z_0-9\{\}]+)',
        # Complex expressions: equations like PV=(PMT+FV)/(1+Z)
        r'([A-Za-z]+\s*=\s*\([^)]+\)/\([^)]+\))',
        r'([A-Za-z]+\s*=\s*[A-Za-z0-9_\{\}\(\)]+/[A-Za-z0-9_\{\}\(\)]+)',
    ]
    
    result = text
    
    # Process each pattern
    for pattern in patterns_to_wrap:
        matches = list(re.finditer(pattern, result))
        # Process in reverse to maintain positions
        for match in reversed(matches):
            start, end = match.span()
            matched_text = match.group(0)
            
            # Skip if already in math mode
            if is_in_math_mode(result, start):
                continue
            
            # Skip if it's just a URL or path
            if '://' in matched_text or '<<<DOLLAR>>>' in matched_text:
                continue
                
            # Skip if already wrapped
            if start > 0 and result[start-1] == '$':
                continue
            if end < len(result) and result[end] == '$':
                continue
            
            # Wrap it
            result = result[:start] + '$' + matched_text + '$' + result[end:]
    
    # Clean up any double dollars that might have been created
    result = re.sub(r'\$\$+', '$', result)
    
    # Fix $$ at boundaries (change to single $)
    result = re.sub(r'\$\s+\$', ' ', result)
    
    return result

def escape_currency_dollars_first(text: str) -> str:
    """Escape all $ signs followed by numbers (currency) BEFORE any other processing."""
    if not text:
        return text
    
    # This runs BEFORE math wrapping
    # Escape $ followed by digit - these are always currency
    # But be smart about context
    
    PLACEHOLDER = "<<<DOLLAR>>>"
    
    # Special case: "Year $1" or "Year $2" is NOT currency, it's "Year 1" or "Year 2"
    # Fix this first
    text = re.sub(r'Year \$(\d+)', r'Year \1', text)
    text = re.sub(r'year \$(\d+)', r'year \1', text)
    
    # Now find all remaining $ followed by digits and replace with placeholder
    text = re.sub(r'\$(\d)', rf'{PLACEHOLDER}\1', text)
    
    # Also handle $ in common currency contexts
    text = text.replace('in $ ', f'in {PLACEHOLDER} ')
    text = text.replace('(in $ ', f'(in {PLACEHOLDER} ')
    text = text.replace('in$ ', f'in{PLACEHOLDER} ')
    text = text.replace('(in$ ', f'(in{PLACEHOLDER} ')
    
    return text

def restore_escaped_dollars(text: str) -> str:
    """Convert placeholder back to escaped dollars AFTER math wrapping."""
    PLACEHOLDER = "<<<DOLLAR>>>"
    # Convert placeholder to \\$ (which is \$ in the actual string, will display as $ in LaTeX)
    text = text.replace(PLACEHOLDER, '\\\\$')
    return text

def fix_unpaired_dollars(text: str) -> str:
    """Fix unpaired $ signs that aren't escaped."""
    if not text:
        return text
    
    # Count $ signs that are not escaped (not preceded by \\)
    # If there's an odd number, something is wrong
    
    # Split by lines and process each
    lines = text.split('\n')
    result_lines = []
    
    for line in lines:
        # Count unescaped $ signs
        unescaped_count = 0
        i = 0
        while i < len(line):
            if line[i] == '$':
                # Check if escaped (preceded by \\)
                if i >= 2 and line[i-2:i] == '\\\\':
                    # Escaped, skip
                    pass
                else:
                    unescaped_count += 1
            i += 1
        
        # If odd number of unescaped $, try to fix
        if unescaped_count % 2 == 1:
            # Find orphan $ and try to pair it or escape it
            # For now, let's escape standalone $ followed by LaTeX commands
            # that aren't properly wrapped
            
            # Pattern: $\times$ or $\approx$ at wrong positions
            # Convert standalone math symbols to wrapped ones
            line = re.sub(r'\$\\times\$', r'$\\times$', line)
            line = re.sub(r'\$\\approx\$', r'$\\approx$', line)
            
            # If still odd, there might be a $ that should be escaped
            # Look for $ followed by word or at end
            # But be very careful not tobreak existing math
        
        result_lines.append(line)
    
    return '\n'.join(result_lines)

def clean_text_field(text: str) -> str:
    """Apply all cleaning operations to a text field."""
    if not text or not isinstance(text, str):
        return text
    
    # Step 1: Fix dollar signs with brackets
    text = fix_dollar_brackets(text)
    
    # Step 2: Escape currency dollars FIRST (before math wrapping)
    text = escape_currency_dollars_first(text)
    
    # Step 3: Fix tilde and approximation symbols
    text = fix_tilde_and_approx(text)
    
    # Step 4: Fix missing spaces
    text = fix_missing_spaces(text)
    
    # Step 5: Fix LaTeX commands
    text = fix_latex_commands(text)
    
    # Step 6: Wrap math expressions (will not wrap placeholders)
    text = wrap_math_expressions(text)
    
    # Step 7: Restore escaped dollars from placeholders
    text = restore_escaped_dollars(text)
    
    # Step 8: Fix any unpaired dollars
    text = fix_unpaired_dollars(text)
    
    # Step 9: Clean up common artifacts
    
    # Fix letter O used instead of zero in context (but be careful)
    text = re.sub(r'(\s|^)O(\d)', r'\g<1>0\2', text)
    text = re.sub(r'(\d)O(\s|$|,|\.)', r'\g<1>0\g<2>', text)
    
    # Fix missing decimal points for specific patterns like "0176" -> "0.176" 
    # But NOT "02" or "08" which might be valid
    text = re.sub(r'\b0(\d{3,})\b', r'0.\1', text)
    
    # Fix patterns like "00.0267" -> "0.0267", "00.267" -> "0.0267" (missing leading digit)
    # This should cover $Z_{12}=00.0882$ and similar
    text = re.sub(r'(\{?\w*\}?)=00\.0(\d+)', r'\1=0.00\2', text)
    text = re.sub(r'(\{?\w*\}?)=00\.(\d{1,2}\d+)', r'\1=0.0\2', text)
    text = re.sub(r'\s00\.0(\d+)', r' 0.00\1', text)
    text = re.sub(r'\s00\.(\d{1,2}\d+)', r' 0.0\1', text)
    text = re.sub(r'([^\d])00\.0(\d+)', r'\g<1>0.00\2', text)
    text = re.sub(r'([^\d])00\.(\d{1,2}\d+)', r'\g<1>0.0\2', text)
    
    # More general: Z=00.0882 -> Z=0.00882
    text = re.sub(r'([A-Za-z_])=00\.0', r'\1=0.00', text)
    text = re.sub(r'([A-Za-z_])=00\.', r'\1=0.0', text)
    
    # Fix patterns inside formulas more generally
    text = re.sub(r'(\w+)=00\.0(\d+)', r'\1=0.00\2', text)
    text = re.sub(r'(\w+)=00\.(\d+)', r'\1=0.0\2', text)
    
    # Fix double decimals created by overzealous replacement
    text = re.sub(r'\b00\.', r'0.0', text)
    
    # Fix triple decimals or more
    while re.search(r'(\d+)(\.0\.)', text):
        text = re.sub(r'(\d+)(\.0\.)', r'\g<1>0.', text)
    
    # Fix specific numeric patterns that are wrong: 10.267 should be 1.0267
    text = re.sub(r'=10\.(\d{3})', r'=1.0\1', text)
    
    # Remove multiple spaces
    text = re.sub(r'  +', ' ', text)
    
    # Clean up spaces before punctuation
    text = re.sub(r'\s+([,\.\;\:!])', r'\1', text)
    
    # Fix common broken words that got incorrectly spaced
    broken_words = {
        'the re ': 'there ',
        'the refore': 'therefore',
        'the ir ': 'their ',
        'the se ': 'these ',
        'with in ': 'within ',
        'with out ': 'without ',
        'for ward ': 'forward ',
        'for mula': 'formula',
        'for egone': 'foregone',
        'in correct': 'incorrect',
        'share holder': 'shareholder',
        'market place': 'marketplace',
        'strate gy': 'strategy',
        'othe rwise': 'otherwise',
        'initial ly': 'initially',
        'gathe rs': 'gathers',
        'infor mation': 'information',
        'theresult': 'the result',
        'therecord': 'the record',
        'thesecond': 'the second',
        'thefirst': 'the first',
        'thethird': 'the third',
        'thelast': 'the last',
        'Year s': 'Years',
        'year s': 'years',
    }
    
    for broken, fixed in broken_words.items():
        text = text.replace(broken, fixed)
    
    return text

def clean_question(question: Dict[str, Any]) -> Dict[str, Any]:
    """Clean all relevant fields in a question object."""
    cleaned = question.copy()
    
    # Fields to clean
    text_fields = [
        'question_text',
        'option_a',
        'option_b', 
        'option_c',
        'explanation_a',
        'explanation_b',
        'explanation_c'
    ]
    
    for field in text_fields:
        if field in cleaned:
            cleaned[field] = clean_text_field(cleaned[field])
    
    return cleaned

def clean_cfa_json(input_file: str, output_file: str):
    """Main function to clean CFA exam JSON data."""
    print(f"Reading {input_file}...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Processing {len(data)} questions...")
    
    cleaned_data = []
    for i, question in enumerate(data, 1):
        if i % 10 == 0:
            print(f"  Processed {i}/{len(data)} questions...")
        cleaned_question = clean_question(question)
        cleaned_data.append(cleaned_question)
    
    print(f"Writing cleaned data to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Done! Cleaned data saved to {output_file}")

if __name__ == "__main__":
    input_file = r"c:\github\she\CFA_lv1_1800_2.0\data\mock1_session2.json"
    output_file = r"c:\github\she\CFA_lv1_1800_2.0\data\mock1_data_cleaned.json"
    
    clean_cfa_json(input_file, output_file)
