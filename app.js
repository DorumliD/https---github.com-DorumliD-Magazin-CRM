// Версия при котором нажатие кнопки "пришел оплатить" вызывает диалоговое окно, где какая чась долга будет покрыт. 

// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('product-form');
//     const productTable = document.getElementById('product-table').querySelector('tbody');
//     const searchInput = document.getElementById('search-input');
//     const salesTable = document.getElementById('sales-table').querySelector('tbody');
//     const salesSearchInput = document.createElement('input');
//     salesSearchInput.placeholder = "Поиск по продажам";
//     document.body.insertBefore(salesSearchInput, salesTable.parentElement);

//     let products = JSON.parse(localStorage.getItem('products')) || [];
//     let sales = JSON.parse(localStorage.getItem('sales')) || {};

//     form.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const name = document.getElementById('product-name').value;
//         const quantity = parseInt(document.getElementById('product-quantity').value, 10);
//         const costPrice = parseFloat(document.getElementById('product-cost-price').value);
//         const salePrice = parseFloat(document.getElementById('product-sale-price').value);

//         const product = { name, quantity, costPrice, salePrice, id: Date.now() };

//         products.push(product);
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         form.reset();
//     });

//     searchInput.addEventListener('input', () => {
//         displayProducts(searchInput.value);
//     });

//     salesSearchInput.addEventListener('input', () => {
//         displaySales(salesSearchInput.value);
//     });

//     function displayProducts(searchTerm = '') {
//         productTable.innerHTML = '';
//         products
//             .filter(product =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.quantity.toString().includes(searchTerm) ||
//                 product.costPrice.toString().includes(searchTerm) ||
//                 product.salePrice.toString().includes(searchTerm)
//             )
//             .forEach(product => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${product.name}</td>
//                     <td>${product.quantity}</td>
//                     <td>${product.costPrice.toFixed(2)}</td>
//                     <td>${product.salePrice.toFixed(2)}</td>
//                     <td>
//                         <button onclick="sellProduct(${product.id})">Продать</button>
//                         <button onclick="editProduct(${product.id})">Редактировать</button>
//                         <button onclick="deleteProduct(${product.id})">Удалить</button>
//                     </td>
//                 `;
//                 productTable.appendChild(row);
//             });
//     }

//     window.sellProduct = (id) => {
//         const product = products.find(p => p.id === id);
//         const quantityToSell = parseInt(prompt(`Введите количество для продажи (доступно: ${product.quantity}):`), 10);
//         const customSalePrice = parseFloat(prompt(`Введите цену продажи (текущая цена: ${product.salePrice.toFixed(2)}):`));
//         const isDebt = confirm('Продажа в долг?');

//         if (isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
//             alert('Некорректное количество или цена. Попробуйте еще раз.');
//             return;
//         }

//         product.quantity -= quantityToSell;
//         const profit = (customSalePrice - product.costPrice) * quantityToSell;
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const saleDetail = {
//             time,
//             name: product.name,
//             quantity: quantityToSell,
//             salePrice: customSalePrice,
//             costPrice: product.costPrice,
//             isDebt,
//             debtPaid: false,
//             remainingDebt: isDebt ? customSalePrice * quantityToSell : 0,
//             paidAmount: 0
//         };

//         sales[date] = sales[date] || { totalProfit: 0, details: [] };
//         sales[date].details.push(saleDetail);

//         // Если продажа не в долг, добавляем прибыль сразу
//         if (!isDebt) {
//             sales[date].totalProfit += profit;
//         }

//         localStorage.setItem('sales', JSON.stringify(sales));
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         displaySales();
//     };

//     window.editProduct = (id) => {
//         const product = products.find(p => p.id === id);
//         document.getElementById('product-name').value = product.name;
//         document.getElementById('product-quantity').value = product.quantity;
//         document.getElementById('product-cost-price').value = product.costPrice;
//         document.getElementById('product-sale-price').value = product.salePrice;
//         deleteProduct(id);
//     };

//     window.deleteProduct = (id) => {
//         products = products.filter(p => p.id !== id);
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//     };

//     function displaySales(searchTerm = '') {
//         salesTable.innerHTML = '';
//         Object.entries(sales).forEach(([date, { totalProfit, details }]) => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${date}</td>
//                 <td>${totalProfit.toFixed(2)}</td>
//                 <td><button onclick="toggleDetails('${date}')">Подробнее</button></td>
//             `;
//             salesTable.appendChild(row);

//             const detailsRow = document.createElement('tr');
//             detailsRow.id = `details-${date}`;
//             detailsRow.style.display = 'none';
//             const detailsContent = details
//                 .filter(detail =>
//                     detail.time.includes(searchTerm) ||
//                     detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     detail.quantity.toString().includes(searchTerm) ||
//                     detail.salePrice.toString().includes(searchTerm) ||
//                     (detail.isDebt ? 'Да' : 'Нет').includes(searchTerm) ||
//                     (detail.debtPaid ? 'Нет' : 'Да').includes(searchTerm)
//                 )
//                 .map(detail => `
//                     <div>
//                         ${detail.time} ${detail.name} ${detail.quantity} ${detail.salePrice.toFixed(2)}
//                         (${detail.isDebt ? 'Да' : 'Нет'}) 
//                         <span>Неоплачено: ${detail.remainingDebt.toFixed(2)}</span>
//                         ${detail.isDebt && detail.remainingDebt > 0 ? 
//                             `<button onclick="payDebt('${date}', '${detail.time}')">Пришел оплатить</button>` 
//                             : ''}
//                     </div>
//                 `).join('');
//             detailsRow.innerHTML = `<td colspan="3">${detailsContent}</td>`;
//             salesTable.appendChild(detailsRow);
//         });
//     }

//     window.toggleDetails = (date) => {
//         const detailsRow = document.getElementById(`details-${date}`);
//         detailsRow.style.display = detailsRow.style.display === 'none' ? '' : 'none';
//     };

//     window.payDebt = (date, time) => {
//         const sale = sales[date].details.find(detail => detail.time === time);
//         if (!sale || !sale.isDebt || sale.remainingDebt <= 0) {
//             alert('Долг уже оплачен или данные не найдены.');
//             return;
//         }

//         const paymentAmount = parseFloat(prompt(`Введите сумму оплаты (осталось: ${sale.remainingDebt.toFixed(2)}):`));
//         if (isNaN(paymentAmount) || paymentAmount <= 0 || paymentAmount > sale.remainingDebt) {
//             alert('Некорректная сумма.');
//             return;
//         }

//         sale.remainingDebt -= paymentAmount;
//         sale.paidAmount += paymentAmount;

//         // Корректный расчет себестоимости оплаченной части и прибыли от оплаты
//         const costForPaidAmount = sale.costPrice * (paymentAmount / sale.salePrice);
//         const profitToAdd = paymentAmount - costForPaidAmount;

//         // Проверка на существование и корректное значение общей прибыли
//         sales[date].totalProfit = parseFloat(sales[date].totalProfit) || 0;
//         sales[date].totalProfit += profitToAdd;

//         if (sale.remainingDebt === 0) {
//             sale.debtPaid = true; // Отмечаем, что долг полностью оплачен
//         }

//         localStorage.setItem('sales', JSON.stringify(sales));
//         displaySales();
//     };

//     displayProducts();
//     displaySales();
// });
// ///////////////////////////////////////////////////////////////////////////////////////////

// Версия при котором нажатие кнопки "пришел оплатить" будет означать, что вес долг был покрыт. 

// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('product-form');
//     const productTable = document.getElementById('product-table').querySelector('tbody');
//     const searchInput = document.getElementById('search-input');
//     const salesTable = document.getElementById('sales-table').querySelector('tbody');
//     const salesSearchInput = document.createElement('input');
//     salesSearchInput.placeholder = "Поиск по продажам";
//     document.body.insertBefore(salesSearchInput, salesTable.parentElement);

//     let products = JSON.parse(localStorage.getItem('products')) || [];
//     let sales = JSON.parse(localStorage.getItem('sales')) || {};

//     form.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const name = document.getElementById('product-name').value;
//         const quantity = parseInt(document.getElementById('product-quantity').value, 10);
//         const costPrice = parseFloat(document.getElementById('product-cost-price').value);
//         const salePrice = parseFloat(document.getElementById('product-sale-price').value);

//         const product = { name, quantity, costPrice, salePrice, id: Date.now() };

//         products.push(product);
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         form.reset();
//     });

//     searchInput.addEventListener('input', () => {
//         displayProducts(searchInput.value);
//     });

//     salesSearchInput.addEventListener('input', () => {
//         displaySales(salesSearchInput.value);
//     });

//     function displayProducts(searchTerm = '') {
//         productTable.innerHTML = '';
//         products
//             .filter(product =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.quantity.toString().includes(searchTerm) ||
//                 product.costPrice.toString().includes(searchTerm) ||
//                 product.salePrice.toString().includes(searchTerm)
//             )
//             .forEach(product => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${product.name}</td>
//                     <td>${product.quantity}</td>
//                     <td>${product.costPrice.toFixed(2)}</td>
//                     <td>${product.salePrice.toFixed(2)}</td>
//                     <td>
//                         <button onclick="sellProduct(${product.id})">Продать</button>
//                         <button onclick="sellProductOnCredit(${product.id})">Продать в долг</button>
//                         <button onclick="editProduct(${product.id})">Редактировать</button>
//                         <button onclick="deleteProduct(${product.id})">Удалить</button>
//                     </td>
//                 `;
//                 productTable.appendChild(row);
//             });
//     }

//     window.sellProduct = (id) => {
//         const product = products.find(p => p.id === id);
//         const quantityToSell = parseInt(prompt(`Введите количество для продажи (доступно: ${product.quantity}):`), 10);
//         const customSalePrice = parseFloat(prompt(`Введите цену продажи (текущая цена: ${product.salePrice.toFixed(2)}):`));

//         if (isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
//             alert('Некорректное количество или цена. Попробуйте еще раз.');
//             return;
//         }

//         product.quantity -= quantityToSell;
//         const profit = (customSalePrice - product.costPrice) * quantityToSell;
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const saleDetail = {
//             time,
//             name: product.name,
//             quantity: quantityToSell,
//             salePrice: customSalePrice,
//             isDebt: false,
//             debtPaid: true,
//             remainingDebt: 0,
//             paidAmount: customSalePrice * quantityToSell,
//             costPrice: product.costPrice
//         };

//         sales[date] = sales[date] || { totalProfit: 0, details: [] };
//         sales[date].details.push(saleDetail);
//         sales[date].totalProfit += profit;

//         localStorage.setItem('sales', JSON.stringify(sales));
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         displaySales();
//     };

//     window.sellProductOnCredit = (id) => {
//         const product = products.find(p => p.id === id);
//         const quantityToSell = parseInt(prompt(`Введите количество для продажи в долг (доступно: ${product.quantity}):`), 10);
//         const customSalePrice = parseFloat(prompt(`Введите цену продажи в долг (текущая цена: ${product.salePrice.toFixed(2)}):`));

//         if (isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
//             alert('Некорректное количество или цена. Попробуйте еще раз.');
//             return;
//         }

//         product.quantity -= quantityToSell;
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const saleDetail = {
//             time,
//             name: product.name,
//             quantity: quantityToSell,
//             salePrice: customSalePrice,
//             isDebt: true,
//             debtPaid: false,
//             remainingDebt: customSalePrice * quantityToSell,
//             paidAmount: 0,
//             costPrice: product.costPrice
//         };

//         sales[date] = sales[date] || { totalProfit: 0, details: [] };
//         sales[date].details.push(saleDetail);

//         localStorage.setItem('sales', JSON.stringify(sales));
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         displaySales();
//     };

//     window.editProduct = (id) => {
//         const product = products.find(p => p.id === id);
//         document.getElementById('product-name').value = product.name;
//         document.getElementById('product-quantity').value = product.quantity;
//         document.getElementById('product-cost-price').value = product.costPrice;
//         document.getElementById('product-sale-price').value = product.salePrice;
//         deleteProduct(id);
//     };

//     window.deleteProduct = (id) => {
//         products = products.filter(p => p.id !== id);
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//     };

//     function displaySales(searchTerm = '') {
//         salesTable.innerHTML = '';
//         Object.entries(sales).forEach(([date, { totalProfit, details }]) => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${date}</td>
//                 <td>${totalProfit.toFixed(2)}</td>
//                 <td><button onclick="toggleDetails('${date}')">Подробнее</button></td>
//             `;
//             salesTable.appendChild(row);

//             const detailsRow = document.createElement('tr');
//             detailsRow.id = `details-${date}`;
//             detailsRow.style.display = 'none';
//             const detailsContent = details
//                 .filter(detail =>
//                     detail.time.includes(searchTerm) ||
//                     detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     detail.quantity.toString().includes(searchTerm) ||
//                     detail.salePrice.toString().includes(searchTerm) ||
//                     (detail.isDebt ? 'Да' : 'Нет').includes(searchTerm) ||
//                     (detail.debtPaid ? 'Нет' : 'Да').includes(searchTerm)
//                 )
//                 .map(detail => `
//                     <div>
//                         ${detail.time} ${detail.name} ${detail.quantity} ${detail.salePrice.toFixed(2)}
//                         (${detail.isDebt ? 'Да' : 'Нет'}) 
//                         <span>Неоплачено: ${detail.remainingDebt.toFixed(2)}</span>
//                         ${detail.isDebt && detail.remainingDebt > 0 ? 
//                             `<button onclick="payDebt('${date}', '${detail.time}')">Пришел оплатить</button>` 
//                             : ''}
//                     </div>
//                 `).join('');
//             detailsRow.innerHTML = `<td colspan="3">${detailsContent}</td>`;
//             salesTable.appendChild(detailsRow);
//         });
//     }

//     window.toggleDetails = (date) => {
//         const detailsRow = document.getElementById(`details-${date}`);
//         detailsRow.style.display = detailsRow.style.display === 'none' ? '' : 'none';
//     };

//     window.payDebt = (date, time) => {
//         const sale = sales[date].details.find(detail => detail.time === time);
//         if (!sale || !sale.isDebt || sale.remainingDebt <= 0) {
//             alert('Долг уже оплачен или данные не найдены.');
//             return;
//         }

//         // Полная оплата оставшегося долга
//         const paymentAmount = sale.remainingDebt;
//         sale.remainingDebt = 0;
//         sale.paidAmount += paymentAmount;
//         sale.debtPaid = true;

//         // Добавляем прибыль от полной оплаты
//         const profitToAdd = (sale.paidAmount / (sale.salePrice * sale.quantity)) * ((sale.salePrice - sale.costPrice) * sale.quantity);
//         sales[date].totalProfit += profitToAdd;

//         localStorage.setItem('sales', JSON.stringify(sales));
//         displaySales();
//     };

//     displayProducts();
//     displaySales();
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('product-form');
//     const productTable = document.getElementById('product-table').querySelector('tbody');
//     const searchInput = document.getElementById('search-input');
//     const salesTable = document.getElementById('sales-table').querySelector('tbody');
//     const salesSearchInput = document.createElement('input');
//     salesSearchInput.placeholder = "Поиск по продажам";
//     document.body.insertBefore(salesSearchInput, salesTable.parentElement);

//     let products = JSON.parse(localStorage.getItem('products')) || [];
//     let sales = JSON.parse(localStorage.getItem('sales')) || {};

//     form.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const name = document.getElementById('product-name').value;
//         const quantity = parseInt(document.getElementById('product-quantity').value, 10);
//         const costPrice = parseFloat(document.getElementById('product-cost-price').value);
//         const salePrice = parseFloat(document.getElementById('product-sale-price').value);

//         const product = { name, quantity, costPrice, salePrice, id: Date.now() };

//         products.push(product);
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         form.reset();
//     });

//     searchInput.addEventListener('input', () => {
//         displayProducts(searchInput.value);
//     });

//     salesSearchInput.addEventListener('input', () => {
//         displaySales(salesSearchInput.value);
//     });

//     function displayProducts(searchTerm = '') {
//         productTable.innerHTML = '';
//         products
//             .filter(product =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.quantity.toString().includes(searchTerm) ||
//                 product.costPrice.toString().includes(searchTerm) ||
//                 product.salePrice.toString().includes(searchTerm)
//             )
//             .forEach(product => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${product.name}</td>
//                     <td>${product.quantity}</td>
//                     <td>${product.costPrice.toFixed(2)}</td>
//                     <td>${product.salePrice.toFixed(2)}</td>
//                     <td>
//                         <button onclick="sellProduct(${product.id})">Продать</button>
//                         <button onclick="sellProductOnCredit(${product.id})">Продать в долг</button>
//                         <button onclick="editProduct(${product.id})">Редактировать</button>
//                         <button onclick="deleteProduct(${product.id})">Удалить</button>
//                     </td>
//                 `;
//                 productTable.appendChild(row);
//             });
//     }

//     window.sellProduct = (id) => {
//         const product = products.find(p => p.id === id);
//         const quantityToSell = parseInt(prompt(`Введите количество для продажи (доступно: ${product.quantity}):`), 10);
//         const customSalePrice = parseFloat(prompt(`Введите цену продажи (текущая цена: ${product.salePrice.toFixed(2)}):`));

//         if (isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
//             alert('Некорректное количество или цена. Попробуйте еще раз.');
//             return;
//         }

//         product.quantity -= quantityToSell;
//         const profit = (customSalePrice - product.costPrice) * quantityToSell;
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const saleDetail = {
//             time,
//             name: product.name,
//             quantity: quantityToSell,
//             salePrice: customSalePrice,
//             isDebt: false,
//             debtPaid: true,
//             remainingDebt: 0,
//             paidAmount: customSalePrice * quantityToSell,
//             costPrice: product.costPrice
//         };

//         sales[date] = sales[date] || { totalProfit: 0, details: [] };
//         sales[date].details.push(saleDetail);
//         sales[date].totalProfit += profit;

//         localStorage.setItem('sales', JSON.stringify(sales));
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         displaySales();
//     };

//     window.sellProductOnCredit = (id) => {
//         const product = products.find(p => p.id === id);
//         const buyerName = prompt("Введите имя покупателя, который покупает в долг:");
//         const quantityToSell = parseInt(prompt(`Введите количество для продажи в долг (доступно: ${product.quantity}):`), 10);
//         const customSalePrice = parseFloat(prompt(`Введите цену продажи в долг (текущая цена: ${product.salePrice.toFixed(2)}):`));

//         if (!buyerName || isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
//             alert('Некорректное имя покупателя, количество или цена. Попробуйте еще раз.');
//             return;
//         }

//         product.quantity -= quantityToSell;
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const saleDetail = {
//             time,
//             name: product.name,
//             quantity: quantityToSell,
//             salePrice: customSalePrice,
//             buyerName, // Имя покупателя
//             isDebt: true,
//             debtPaid: false,
//             remainingDebt: customSalePrice * quantityToSell,
//             paidAmount: 0,
//             costPrice: product.costPrice
//         };

//         sales[date] = sales[date] || { totalProfit: 0, details: [] };
//         sales[date].details.push(saleDetail);

//         localStorage.setItem('sales', JSON.stringify(sales));
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//         displaySales();
//     };

//     window.editProduct = (id) => {
//         const product = products.find(p => p.id === id);
//         document.getElementById('product-name').value = product.name;
//         document.getElementById('product-quantity').value = product.quantity;
//         document.getElementById('product-cost-price').value = product.costPrice;
//         document.getElementById('product-sale-price').value = product.salePrice;
//         deleteProduct(id);
//     };

//     window.deleteProduct = (id) => {
//         products = products.filter(p => p.id !== id);
//         localStorage.setItem('products', JSON.stringify(products));
//         displayProducts();
//     };

//     function displaySales(searchTerm = '') {
//         salesTable.innerHTML = '';
//         Object.entries(sales).forEach(([date, { totalProfit, details }]) => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${date}</td>
//                 <td>${totalProfit.toFixed(2)}</td>
//                 <td><button onclick="toggleDetails('${date}')">Подробнее</button></td>
//             `;
//             salesTable.appendChild(row);

//             const detailsRow = document.createElement('tr');
//             detailsRow.id = `details-${date}`;
//             detailsRow.style.display = 'none';
//             const detailsContent = details
//                 .filter(detail =>
//                     detail.time.includes(searchTerm) ||
//                     detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     detail.quantity.toString().includes(searchTerm) ||
//                     detail.salePrice.toString().includes(searchTerm) ||
//                     (detail.isDebt ? 'Да' : 'Нет').includes(searchTerm) ||
//                     (detail.debtPaid ? 'Нет' : 'Да').includes(searchTerm) ||
//                     (detail.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) // Фильтрация по имени покупателя
//                 )
//                 .map(detail => `
//                     <div>
//                         ${detail.time} ${detail.name} ${detail.quantity} ${detail.salePrice.toFixed(2)}
//                         (${detail.isDebt ? 'Да' : 'Нет'}) Покупатель: ${detail.buyerName || 'Не указан'}
//                         <span>Неоплачено: ${detail.remainingDebt.toFixed(2)}</span>
//                         ${detail.isDebt && detail.remainingDebt > 0 ? 
//                             `<button onclick="payDebt('${date}', '${detail.time}')">Пришел оплатить</button>` 
//                             : ''}
//                     </div>
//                 `).join('');
//             detailsRow.innerHTML = `<td colspan="3">${detailsContent}</td>`;
//             salesTable.appendChild(detailsRow);
//         });
//     }

//     window.toggleDetails = (date) => {
//         const detailsRow = document.getElementById(`details-${date}`);
//         detailsRow.style.display = detailsRow.style.display === 'none' ? '' : 'none';
//     };

//     window.payDebt = (date, time) => {
//         const sale = sales[date].details.find(detail => detail.time === time);
//         if (!sale || !sale.isDebt || sale.remainingDebt <= 0) {
//             alert('Долг уже оплачен или данные не найдены.');
//             return;
//         }

//         // Полная оплата оставшегося долга
//         const paymentAmount = sale.remainingDebt;
//         sale.remainingDebt = 0;
//         sale.paidAmount += paymentAmount;
//         sale.debtPaid = true; // Долг полностью оплачен

//         // Добавление прибыли после полной оплаты
//         const profitToAdd = sale.salePrice * sale.quantity - sale.costPrice * sale.quantity;
//         sales[date].totalProfit += profitToAdd;

//         localStorage.setItem('sales', JSON.stringify(sales));
//         displaySales();
//     };

//     displayProducts();
//     displaySales();
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Вариант с использованием импорт и экспорт данных

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const productTable = document.getElementById('product-table').querySelector('tbody');
    const searchInput = document.getElementById('search-input');
    const salesTable = document.getElementById('sales-table').querySelector('tbody');
    const salesSearchInput = document.createElement('input');
    salesSearchInput.placeholder = "Поиск по продажам                  ➡";
    salesSearchInput.id = 'search-input';
    document.body.insertBefore(salesSearchInput, salesTable.parentElement);

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let sales = JSON.parse(localStorage.getItem('sales')) || {};

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const quantity = parseInt(document.getElementById('product-quantity').value, 10);
        const costPrice = parseFloat(document.getElementById('product-cost-price').value);
        const salePrice = parseFloat(document.getElementById('product-sale-price').value);

        const product = { name, quantity, costPrice, salePrice, id: Date.now() };

        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        form.reset();
    });

    searchInput.addEventListener('input', () => {
        displayProducts(searchInput.value);
    });

    salesSearchInput.addEventListener('input', () => {
        displaySales(salesSearchInput.value);
    });

    function displayProducts(searchTerm = '') {
        productTable.innerHTML = '';
        products
            .filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.quantity.toString().includes(searchTerm) ||
                product.costPrice.toString().includes(searchTerm) ||
                product.salePrice.toString().includes(searchTerm)
            )
            .forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.costPrice.toFixed(2)}</td>
                    <td>${product.salePrice.toFixed(2)}</td>
                    <td>
                        <button onclick="sellProduct(${product.id})">Продать</button>
                        <button onclick="sellProductOnCredit(${product.id})">Продать в долг</button>
                        <button onclick="editProduct(${product.id})">Редактировать</button>
                        <button onclick="deleteProduct(${product.id})">Удалить</button>
                    </td>
                `;
                productTable.appendChild(row);
            });
    }

    window.sellProduct = (id) => {
        const product = products.find(p => p.id === id);
        const quantityToSell = parseInt(prompt(`Введите количество для продажи (доступно: ${product.quantity}):`), 10);
        const customSalePrice = parseFloat(prompt(`Введите цену продажи (текущая цена: ${product.salePrice.toFixed(2)}):`));

        if (isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
            alert('Некорректное количество или цена. Попробуйте еще раз.');
            return;
        }

        product.quantity -= quantityToSell;
        const profit = (customSalePrice - product.costPrice) * quantityToSell;
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const saleDetail = {
            time,
            name: product.name,
            quantity: quantityToSell,
            salePrice: customSalePrice,
            isDebt: false,
            debtPaid: true,
            remainingDebt: 0,
            paidAmount: customSalePrice * quantityToSell,
            costPrice: product.costPrice
        };

        sales[date] = sales[date] || { totalProfit: 0, details: [] };
        sales[date].details.push(saleDetail);
        sales[date].totalProfit += profit;

        localStorage.setItem('sales', JSON.stringify(sales));
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        displaySales();
    };

    window.sellProductOnCredit = (id) => {
        const product = products.find(p => p.id === id);
        const buyerName = prompt("Введите имя покупателя, который покупает в долг:");
        const quantityToSell = parseInt(prompt(`Введите количество для продажи в долг (доступно: ${product.quantity}):`), 10);
        const customSalePrice = parseFloat(prompt(`Введите цену продажи в долг (текущая цена: ${product.salePrice.toFixed(2)}):`));

        if (!buyerName || isNaN(quantityToSell) || isNaN(customSalePrice) || quantityToSell > product.quantity || quantityToSell <= 0) {
            alert('Некорректное имя покупателя, количество или цена. Попробуйте еще раз.');
            return;
        }

        product.quantity -= quantityToSell;
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const saleDetail = {
            time,
            name: product.name,
            quantity: quantityToSell,
            salePrice: customSalePrice,
            buyerName, // Имя покупателя
            isDebt: true,
            debtPaid: false,
            remainingDebt: customSalePrice * quantityToSell,
            paidAmount: 0,
            costPrice: product.costPrice
        };

        sales[date] = sales[date] || { totalProfit: 0, details: [] };
        sales[date].details.push(saleDetail);

        localStorage.setItem('sales', JSON.stringify(sales));
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        displaySales();
    };

    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-cost-price').value = product.costPrice;
        document.getElementById('product-sale-price').value = product.salePrice;
        deleteProduct(id);
    };

    window.deleteProduct = (id) => {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    };

    function displaySales(searchTerm = '') {
        salesTable.innerHTML = '';
        Object.entries(sales).forEach(([date, { totalProfit, details }]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${totalProfit.toFixed(2)}</td>
                <td><button onclick="toggleDetails('${date}')">Подробнее</button></td>
            `;
            salesTable.appendChild(row);

            const detailsRow = document.createElement('tr');
            detailsRow.id = `details-${date}`;
            detailsRow.style.display = 'none';
            const detailsContent = details
                .filter(detail =>
                    detail.time.includes(searchTerm) ||
                    detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    detail.quantity.toString().includes(searchTerm) ||
                    detail.salePrice.toString().includes(searchTerm) ||
                    (detail.isDebt ? 'Да' : 'Нет').includes(searchTerm) ||
                    (detail.debtPaid ? 'Нет' : 'Да').includes(searchTerm) ||
                    (detail.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) // Фильтрация по имени покупателя
                )
                .map(detail => `
                    <div>
                        ${detail.time} ${detail.name} ${detail.quantity} ${detail.salePrice.toFixed(2)}
                        (${detail.isDebt ? 'Да' : 'Нет'}) Покупатель: ${detail.buyerName || 'Не указан'}
                        <span>Неоплачено: ${detail.remainingDebt.toFixed(2)}</span>
                        ${detail.isDebt && detail.remainingDebt > 0 ? 
                            `<button onclick="payDebt('${date}', '${detail.time}')">Пришел оплатить</button>` 
                            : ''}
                    </div>
                `).join('');
            detailsRow.innerHTML = `<td colspan="3">${detailsContent}</td>`;
            salesTable.appendChild(detailsRow);
        });
    }

    window.toggleDetails = (date) => {
        const detailsRow = document.getElementById(`details-${date}`);
        detailsRow.style.display = detailsRow.style.display === 'none' ? '' : 'none';
    };

    window.payDebt = (date, time) => {
        const sale = sales[date].details.find(detail => detail.time === time);
        if (!sale || !sale.isDebt || sale.remainingDebt <= 0) {
            alert('Долг уже оплачен или данные не найдены.');
            return;
        }

        // Полная оплата оставшегося долга
        const paymentAmount = sale.remainingDebt;
        sale.remainingDebt = 0;
        sale.paidAmount += paymentAmount;
        sale.debtPaid = true; // Долг полностью оплачен

        // Добавление прибыли после полной оплаты
        const profitToAdd = sale.salePrice * sale.quantity - sale.costPrice * sale.quantity;
        sales[date].totalProfit += profitToAdd;

        localStorage.setItem('sales', JSON.stringify(sales));
        displaySales();
    };


    
    // Функция для импорта данных о продажах
    function importSales() {
        const fileInput = document.getElementById('file-input');
        if (fileInput.files.length === 0) {
            alert('Выберите файл для импорта.');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const importedSales = JSON.parse(reader.result);
            // Объединяем импортированные данные с текущими
            for (const [date, { totalProfit, details }] of Object.entries(importedSales)) {
                sales[date] = sales[date] || { totalProfit: 0, details: [] };
                sales[date].totalProfit += totalProfit;
                sales[date].details.push(...details);
            }
            
            localStorage.setItem('sales', JSON.stringify(sales));
            displaySales();
            alert('Данные успешно импортированы!');
        } catch (e) {
            alert('Ошибка при импортировании данных.');
        }
    };
    reader.readAsText(file);
    }

    
    displayProducts();
    displaySales();
});

function mode(){
    let myInput = document.querySelector('input');
    let myH1 = document.querySelector('h1');
    if(myInput.value =='🌙'){
        document.body.style.backgroundColor = 'rgb(10, 10, 86)';
        document.body.style.color = 'yellow';
        myInput.style.backgroundColor = 'white';
        myInput.value = '🌞';
        myH1.style.color = 'yellow';
    }else{
        document.body.style.backgroundColor = '#f4f4f9';
        document.body.style.color = 'black';
        myInput.value = '🌙';
        myInput.style.backgroundColor = 'black';
        myH1.style.color = '#333';
    }
}


// экспорт пока не работает :(
// function exportSales() {
//     try {
//         const salesData = JSON.stringify(sales, null, 2);
//         const blob = new Blob([salesData], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'sales_data.json';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//         console.log('Экспорт данных успешен.');
//     } catch (e) {
//         console.error('Ошибка при экспорте данных:', e);
//         alert('Ошибка при экспорте данных.');
//     }
// }