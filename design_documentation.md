# Design Documentation: Finance For Me (Personal Finance Tracker)

## Project Overview
A comprehensive, all-in-one personal finance manager designed for a single user. The app focuses on historical tracking via OCR and future financial planning through predictive modeling.

## Core Features
1. **Responsive Dashboard**: Optimized for both Desktop and Mobile Web.
2. **Predictive Cash-Flow**: A "Future Balance" line chart showing projected wealth over the next 30-90 days based on recurring transactions.
3. **OCR Receipt Scanner**:
    *   Upload images/screenshots of receipts.
    *   Automatic extraction of Store Name, Itemized List, Prices, and Total.
    *   Manual review and categorization (e.g., Makanan vs. Non-Makanan).
4. **Currency Support**: Native Rupiah (IDR) formatting.

## Technical Architecture
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Shadcn/UI.
- **Backend-as-a-Service**: Firebase.
    - **Authentication**: Firebase Auth (Email/Google).
    - **Database**: Cloud Firestore.
    - **Storage**: Firebase Storage (for receipt images).
    - **Compute**: Cloud Functions (for OCR processing).
- **OCR Engine**: Google Cloud Vision API.

## Data Schema (Firestore)

### `users/{userId}`
- `displayName`: string
- `currency`: "IDR"
- `currentBalance`: number
- `lastSync`: timestamp

### `transactions/{transactionId}`
- `userId`: string
- `date`: timestamp
- `description`: string
- `amount`: number
- `category`: string
- `type`: "income" | "expense"
- `isRecurring`: boolean
- `recurrenceInterval`: "monthly" | "weekly" | null
- `receiptUrl`: string (optional)

### `ocr_pending/{scanId}`
- `userId`: string
- `imageUrl`: string
- `status`: "processing" | "ready" | "confirmed"
- `detectedData`: JSON (Extracted items and prices)

## Decision Log
| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **Tech Stack** | Next.js + Firebase | Robust serverless scaling, secure auth, and direct integration with Cloud Vision. |
| **OCR Service** | Google Cloud Vision | Superior accuracy for Indonesian receipt layouts and fonts. |
| **Review Flow** | Manual-in-the-loop | Prevents OCR errors from corrupting the main ledger data. |
| **Forecasting** | Dotted-line Visualization | Clearly distinguishes between actual data and future predictions. |
| **Currency** | Rupiah (IDR) | Tailored to the user's primary economic context. |

## Success Criteria
- [ ] User can see their projected balance 30 days into the future.
- [ ] OCR takes less than 10 seconds to extract items from a clear photo.
- [ ] The interface is premium and responsive across devices.
