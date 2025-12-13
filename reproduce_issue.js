
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyTNRpTup97ipSS2ceSjOC9lkekTXMBBxi_QZpPHheZ4Mn_6yVV7fOtmGTHrRZjJHcM/exec";

const request = async (action, data = {}) => {
    if (!GOOGLE_SHEETS_URL) {
        throw new Error('Google Sheets URL is not configured');
    }

    console.log(`Requesting action: ${action} with data:`, data);

    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ action, ...data })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Google Sheets API Error: ${response.status} - ${text}`);
        }

        const result = await response.json();
        if (result.status === 'error') {
            throw new Error(result.message);
        }
        return result.data;
    } catch (error) {
        console.error("Request failed:", error);
        throw error;
    }
};

const getPublishedContent = async (uuid) => {
    try {
        const data = await request('getPublishedContent', { id: uuid });
        if (!data) {
            console.log("No data returned");
            return null;
        }
        console.log("Data returned:", data);

        // Emulate ViewMode processing
        const processed = {
            ...data,
            blocks: data.blocks ? JSON.parse(data.blocks) : [],
            metadata: data.metadata ? JSON.parse(data.metadata) : {}
        };
        console.log("Processed data:", processed);
        return processed;
    } catch (error) {
        console.warn('Faield to get published content', error);
        return null;
    }
};

const uuid = "59912d44-8b4c-46a5-9bd9-23902e5ad36b";
console.log(`Testing with UUID: ${uuid}`);
getPublishedContent(uuid);
