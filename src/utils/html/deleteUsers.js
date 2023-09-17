async function deleteUsersHtml(name) {
    const deleteUsersHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .message-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .message-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                .message-text {
                    font-size: 16px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="message-container">
                <div class="message-title">Usuario Eliminado</div>
                <div class="message-text">
                    El usuario ${name} ha sido eliminado porque ha superado los 2 días sin conexión.
                </div>
            </div>
        </body>
        </html>
    `;
    return deleteUsersHTML; 
};

export { deleteUsersHtml };