async function deleteProductsHtml(name, product) {
    const deleteProductHTML = `
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
                <div class="message-title">Producto Eliminado</div>
                <div class="message-text">
                    El prducto ${product} que corresponde al usuario ${name} ha sido eliminado
                </div>
            </div>
        </body>
        </html>
    `;
    return deleteProductHTML; 
};

export { deleteProductsHtml };