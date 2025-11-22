import React from 'react';

const FormBlock = ({ content, styles }) => {
    const { title = 'Input Form', buttonText = 'Submit', fields = [] } = content;
    const { backgroundColor = 'transparent' } = styles || {};

    return (
        <div style={{ backgroundColor, padding: '20px' }}>
            {title && (
                <h3 className="text-lg font-bold mb-4 text-gray-900">{title}</h3>
            )}

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {fields.map((field, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder={field.placeholder || 'Enter text...'}
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
