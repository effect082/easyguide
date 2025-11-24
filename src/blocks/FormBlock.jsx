import React from 'react';

const FormBlock = ({ content, styles }) => {
    const { title = 'Input Form', buttonText = 'Submit', fields = [] } = content;
    const {
        backgroundColor = 'transparent',
        textAlign = 'left',
        fontSize = 'medium',
        color = '#000000',
        fontWeight = 'normal'
    } = styles || {};

    const [formData, setFormData] = React.useState({});

    // Ensure Name and Phone exist if fields is empty (backward compatibility or new default)
    const displayFields = fields.length > 0 ? fields : [
        { label: '이름', placeholder: '이름을 입력하세요', type: 'text' },
        { label: '전화번호', placeholder: '전화번호를 입력하세요', type: 'tel' }
    ];

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        let match;
        if (cleaned.length <= 9) {
            // 02-XXX-XXXX
            if (cleaned.startsWith('02')) {
                match = cleaned.match(/^(\d{2})(\d{3,4})(\d{4})$/);
            } else {
                // 0XX-XXX-XXXX (general)
                match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            }
        } else {
            // 010-XXXX-XXXX
            match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
        }

        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return value;
    };

    const handleInputChange = (e, fieldLabel) => {
        let value = e.target.value;

        if (fieldLabel === '전화번호' || fieldLabel.includes('Phone')) {
            // Remove non-digits for processing
            const numericValue = value.replace(/\D/g, '');
            // Prevent entering more than 11 digits
            if (numericValue.length > 11) return;

            // Auto-format
            if (numericValue.length >= 9) { // Start formatting when length is sufficient
                value = formatPhoneNumber(numericValue);
            } else {
                value = numericValue;
            }
        }

        setFormData({ ...formData, [fieldLabel]: value });
    };

    const getFontSize = (size) => {
        switch (size) {
            case 'small': return '0.875rem';
            case 'medium': return '1rem';
            case 'large': return '1.25rem';
            default: return '1rem';
        }
    };

    return (
        <div style={{ backgroundColor, padding: '20px' }}>
            {title && (
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#111827',
                    textAlign: textAlign
                }}>{title}</h3>
            )}

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('제출되었습니다 (데모)'); }}>
                {displayFields.map((field, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label || field.placeholder}
                        </label>
                        <input
                            type={field.type || 'text'}
                            placeholder={field.placeholder || 'Enter text...'}
                            value={formData[field.label] || ''}
                            onChange={(e) => handleInputChange(e, field.label)}
                            style={{
                                fontSize: getFontSize(fontSize),
                                color: color,
                                fontWeight: fontWeight,
                                textAlign: textAlign
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {buttonText}
                </button>
            </form>
        </div>
    );
};

export default FormBlock;
