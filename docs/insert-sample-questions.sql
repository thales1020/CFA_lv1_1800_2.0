-- Script để tạo exam và questions mẫu cho testing Review Mode
-- Copy và paste vào Supabase SQL Editor

-- 1. Insert exam record
INSERT INTO exams (id, title, description, duration_minutes, total_questions)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'CFA Level 1 Mock Exam',
  'Practice exam for CFA Level 1',
  120,
  20
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert 20 sample questions
INSERT INTO questions (id, exam_id, question_text, option_a, option_b, option_c, correct_option, order_num, explanation)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 
   'What is the primary goal of diversification in portfolio management?',
   'Maximize returns', 'Minimize risk', 'Increase trading volume', 'B', 1,
   'Diversification aims to reduce portfolio risk by investing in a variety of assets that are not perfectly correlated. While it may impact returns, its primary purpose is risk reduction.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'According to the Capital Asset Pricing Model (CAPM), what is the relationship between beta and expected return?',
   'Inverse relationship', 'No relationship', 'Positive relationship', 'C', 2,
   'CAPM shows a positive linear relationship between beta and expected return. Higher beta securities have higher expected returns to compensate for higher systematic risk.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'Which market efficiency form suggests that stock prices reflect all publicly available information?',
   'Weak form', 'Semi-strong form', 'Strong form', 'B', 3,
   'Semi-strong form efficiency states that prices reflect all publicly available information including financial statements, news, and announcements. Weak form only incorporates historical prices, while strong form includes private information.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What does a duration of 5 years for a bond indicate?',
   'Bond matures in 5 years', 'Bond price sensitivity to interest rate changes', 'Bond pays coupons for 5 years', 'B', 4,
   'Duration measures a bond''s price sensitivity to interest rate changes. A duration of 5 means the bond price will change approximately 5% for each 1% change in interest rates.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'In behavioral finance, what is "anchoring"?',
   'Relying too heavily on first information', 'Following market trends', 'Diversifying investments', 'A', 5,
   'Anchoring is the cognitive bias where investors rely too heavily on the first piece of information (the anchor) when making decisions, even when that information may not be relevant.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What is the P/E ratio used to evaluate?',
   'Bond value', 'Stock valuation', 'Currency strength', 'B', 6,
   'The Price-to-Earnings (P/E) ratio is a key metric for stock valuation, showing how much investors are willing to pay per dollar of earnings. It helps compare relative values of companies.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'Which financial statement shows a company''s financial position at a specific point in time?',
   'Income Statement', 'Balance Sheet', 'Cash Flow Statement', 'B', 7,
   'The Balance Sheet provides a snapshot of a company''s assets, liabilities, and equity at a specific date. The Income Statement shows performance over a period, and the Cash Flow Statement tracks cash movements.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What is the main purpose of the Sharpe Ratio?',
   'Measure total return', 'Measure risk-adjusted return', 'Measure trading volume', 'B', 8,
   'The Sharpe Ratio measures risk-adjusted return by showing excess return per unit of risk (standard deviation). A higher Sharpe Ratio indicates better risk-adjusted performance.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'In corporate finance, what does WACC stand for?',
   'Working Asset Capital Cost', 'Weighted Average Cost of Capital', 'World Accounting Cost Center', 'B', 9,
   'WACC (Weighted Average Cost of Capital) represents the average rate a company pays to finance its assets, weighted by the proportion of debt and equity. It''s used for investment decisions and valuation.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'Which type of risk cannot be eliminated through diversification?',
   'Systematic risk', 'Unsystematic risk', 'Company-specific risk', 'A', 10,
   'Systematic risk (market risk) affects all securities and cannot be eliminated through diversification. Unsystematic risk is company-specific and can be reduced by holding a diversified portfolio.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What is the yield curve?',
   'Graph of bond yields vs maturity', 'Stock price trend', 'Currency exchange rate', 'A', 11,
   'The yield curve plots interest rates (yields) of bonds with equal credit quality but different maturity dates. Its shape provides insights into future interest rate expectations and economic conditions.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What does NPV stand for in capital budgeting?',
   'Net Present Value', 'New Project Value', 'Nominal Price Variance', 'A', 12,
   'Net Present Value (NPV) is the difference between the present value of cash inflows and outflows. A positive NPV indicates a profitable investment. It''s a key tool for capital budgeting decisions.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'Which derivative gives the right but not obligation to buy/sell?',
   'Futures', 'Options', 'Forwards', 'B', 13,
   'Options give the holder the right, but not the obligation, to buy (call) or sell (put) an asset at a specified price. Futures and forwards create obligations for both parties.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What is the primary characteristic of a mutual fund?',
   'Fixed returns', 'Pooled investment', 'No management fees', 'B', 14,
   'Mutual funds pool money from many investors to invest in a diversified portfolio of securities. This allows small investors to access professional management and diversification.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What does GDP measure?',
   'Government debt', 'Total economic output', 'Stock market value', 'B', 15,
   'Gross Domestic Product (GDP) measures the total monetary value of all goods and services produced within a country''s borders during a specific period. It''s a key indicator of economic health.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'Which ratio measures a company''s ability to pay short-term obligations?',
   'Debt-to-Equity', 'Current Ratio', 'ROE', 'B', 16,
   'The Current Ratio (current assets / current liabilities) measures liquidity and the ability to pay short-term obligations. A ratio above 1 indicates the company can cover its current liabilities.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What is insider trading?',
   'Trading during market hours', 'Trading on non-public information', 'Trading large volumes', 'B', 17,
   'Insider trading refers to buying or selling securities based on material non-public information. It''s illegal and violates securities laws because it creates unfair advantages.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What does EBITDA represent?',
   'Earnings before interest, taxes, depreciation, amortization', 'Expected Book Income', 'Equity Before Initial Tax', 'A', 18,
   'EBITDA measures a company''s operating performance by excluding non-operating expenses like interest, taxes, and non-cash charges. It''s useful for comparing profitability across companies.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'Which asset class typically has the highest historical returns?',
   'Bonds', 'Stocks', 'Cash', 'B', 19,
   'Historically, stocks (equities) have provided the highest long-term returns among major asset classes, though they also carry higher risk. Bonds offer lower but more stable returns.'),
   
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000',
   'What is the main purpose of hedging?',
   'Increase profits', 'Reduce risk', 'Avoid taxes', 'B', 20,
   'Hedging is a risk management strategy used to offset potential losses in investments by taking an opposite position in a related asset. The primary goal is risk reduction, not profit maximization.');

SELECT 'Questions inserted successfully! ✅' as result;
