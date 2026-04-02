# AI Quote Generator Design

## Overview
Replace the "Request Quote" button with an instant AI-powered price estimate that analyzes user input and generates a quotation in the user's local currency.

## User Flow

1. User completes steps 1-3 (Service, Scope, Details)
2. In step 4 (Review), user selects their country from a dropdown
3. User clicks "Get Quote" button
4. Loading animation displays while AI processes
5. AI generates price estimate displayed on screen

## Key Decisions

- **API**: Client-side calls to OpenRouter with API key from `.env`
- **Currency**: Manual country/currency selection dropdown
- **Model**: Fast free model (e.g., Qwen or Llama)
- **Input**: Uses existing project description from step 3
- **Loading**: Show animated loading state

## UI Changes

### Step 4 (Review) Modifications

1. **Add Country Selector**: Dropdown above the selected options showing country/currency
2. **Replace Request Quote Button**: Change to "Get Quote" button
3. **Add Loading State**: Display animated loading during API call
4. **Display Quote Result**: Show AI-generated price in selected currency

### Country/Currency Mapping

Predefined list of countries with their currencies:
- United States → USD ($)
- United Kingdom → GBP (£)
- European Union → EUR (€)
- Canada → CAD (C$)
- Australia → AUD (A$)
- Japan → JPY (¥)
- India → INR (₹)
- Brazil → BRL (R$)
- etc.

## API Integration

### OpenRouter Request

```json
{
  "model": "qwen/qwen-2.5-7b-instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are a software development pricing expert. Analyze the project description and provide a price estimate in the specified currency. Be specific and realistic."
    },
    {
      "role": "user",
      "content": "Project: {service} - {scope}\nDetails: {description}\nGenerate a price estimate in {currency}."
    }
  ],
  "temperature": 0.3
}
```

### Response Handling

- Parse AI response for price estimate
- Format number with proper currency symbol
- Display in a prominent quote card

## Implementation Notes

- Create `.env.example` with `VITE_OPENROUTER_API_KEY=your-key`
- Add `import.meta.env.VITE_OPENROUTER_API_KEY` for Vite env access
- Add country/currency dropdown to step 4
- Replace alert with quote display card
- Add loading state with typing animation
