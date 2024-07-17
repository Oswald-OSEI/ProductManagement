// Global variables
let products = [];
let categories = [];
let currentPage = 0;
let totalPages = 0;
let pageSize = 6;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();

    document.querySelector('.add-product-btn').addEventListener('click', showAddProductForm);
    document.getElementById('applyChangesBtn').addEventListener('click', editProduct);
    document.getElementById('addNewProductBtn').addEventListener('click', addProduct);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('showAddCategoryBtn').addEventListener('click', showAddCategoryForm);
    document.getElementById('addNewCategoryBtn').addEventListener('click', addCategory);

    // Close modals when clicking on the close button or outside the modal
    document.querySelectorAll('.close, .modal').forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target === element) {
                element.closest('.modal').style.display = 'none';
            }
        });
    });
});

// Function to fetch categories from the backend
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Function to render categories
function renderCategories() {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = '<li class="category-item"><span class="category-name" onclick="filterProductsByCategory(null)">All Products</span></li>';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'category-item';
        li.innerHTML = `
            <span class="category-name" onclick="filterProductsByCategory(${category.categoryId})">${category.categoryName}</span>
            <div class="category-actions">
                <span class="edit-icon" onclick="editCategory(${category.categoryId})">✏️</span>
                <span class="delete-icon" onclick="deleteCategory(${category.categoryId})">🗑️</span>
            </div>
        `;
        categoryList.appendChild(li);
    });
}

// Function to fetch products from the backend
async function fetchProducts(page = 0) {
    try {
        const response = await fetch(`/api/products?page=${page}&size=${pageSize}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        products = data.content;
        currentPage = data.number;
        totalPages = data.totalPages;
        renderProducts();
        renderPagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to render products
function renderProducts() {
    const productDisplay = document.querySelector('.product-display');
    productDisplay.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-tile';
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        div.addEventListener('click', () => showProductDetails(product));
        productDisplay.appendChild(div);
    });
}

// Function to render pagination
function renderPagination() {
    const paginationElement = document.querySelector('.pagination');
    paginationElement.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 0;
    prevButton.addEventListener('click', () => fetchProducts(currentPage - 1));
    paginationElement.appendChild(prevButton);

    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i + 1;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => fetchProducts(i));
        paginationElement.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages - 1;
    nextButton.addEventListener('click', () => fetchProducts(currentPage + 1));
    paginationElement.appendChild(nextButton);
}

// Function to show product details
function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const details = document.getElementById('productDetails');
    details.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Description: ${product.description}</p>
        <p>Category: ${product.category.categoryName}</p>
    `;
    modal.style.display = 'block';

    document.getElementById('editProductBtn').onclick = () => showEditProductForm(product);
    document.getElementById('deleteProductBtn').onclick = () => deleteProduct(product.id);
}

// Function to show edit product form
function showEditProductForm(product) {
    const modal = document.getElementById('editProductModal');
    const form = document.getElementById('editProductForm');
    form.innerHTML = `
        <input type="hidden" id="editProductId" value="${product.id}">
        <input type="text" id="editProductName" value="${product.name}" required>
        <input type="number" id="editProductPrice" value="${product.price}" required>
        <input type="number" id="editProductStock" value="${product.stock}" required>
        <textarea id="editProductDescription" required>${product.description}</textarea>
        <select id="editProductCategory" required>
            ${categories.map(cat => `<option value="${cat.categoryId}" ${cat.categoryId === product.category.categoryId ? 'selected' : ''}>${cat.categoryName}</option>`).join('')}
        </select>
    `;
    modal.style.display = 'block';
}

// Function to edit a product
async function editProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const price = document.getElementById('editProductPrice').value;
    const stock = document.getElementById('editProductStock').value;
    const description = document.getElementById('editProductDescription').value;
    const categoryId = document.getElementById('editProductCategory').value;

    try {
        const response = await fetch('/api/products/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                name,
                price,
                stock,
                description,
                category: { categoryId }
            }),
        });
        if (response.ok) {
            document.getElementById('editProductModal').style.display = 'none';
            fetchProducts(currentPage);
        }
    } catch (error) {
        console.error('Error editing product:', error);
    }
}

// Function to delete a product
async function deleteProduct(id) {
    try {
        const response = await fetch(`/api/products/deleteProduct/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            document.getElementById('productModal').style.display = 'none';
            fetchProducts(currentPage);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Function to show add product form
function showAddProductForm() {
    const modal = document.getElementById('addProductModal');
    const form = document.getElementById('addProductForm');
    form.innerHTML = `
        <input type="text" id="newProductName" placeholder="Product Name" required>
        <input type="number" id="newProductPrice" placeholder="Price" required>
        <input type="number" id="newProductStock" placeholder="Stock" required>
        <textarea id="newProductDescription" placeholder="Description" required></textarea>
        <select id="newProductCategory" required>
            ${categories.map(cat => `<option value="${cat.categoryId}">${cat.categoryName}</option>`).join('')}
        </select>
    `;
    modal.style.display = 'block';
}

// Function to add a new product
async function addProduct() {
    const name = document.getElementById('newProductName').value;
    const price = parseFloat(document.getElementById('newProductPrice').value);
    const stock = parseInt(document.getElementById('newProductStock').value);
    const description = document.getElementById('newProductDescription').value;
    const categoryId = parseInt(document.getElementById('newProductCategory').value);

    const productModel = {
        name,
        price,
        stock,
        description,
        category: { categoryId }
    };

    try {
        const response = await fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productModel),
        });
        
        if (response.ok) {
            const savedProduct = await response.json();
            document.getElementById('addProductModal').style.display = 'none';
            fetchProducts(currentPage);
            console.log('Product added successfully:', savedProduct);
        } else {
            const errorData = await response.json();
            console.error('Error adding product:', errorData);
            displayErrorMessage(errorData.message || "Error adding product.");
        }
    } catch (error) {
        console.error('Error adding product:', error);
        displayErrorMessage("An error occurred while adding the product.");
    }
}

// Function to edit a category
function editCategory(id) {
    const modal = document.getElementById('editCategoryModal');
    const input = document.getElementById('editCategoryName');
    const category = categories.find(cat => cat.categoryId === id);
    input.value = category.categoryName;
    modal.style.display = 'block';

    document.getElementById('updateCategoryBtn').onclick = async () => {
        try {
            const response = await fetch('/api/categories/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryId: id,
                    categoryName: input.value
                }),
            });
            if (response.ok) {
                modal.style.display = 'none';
                fetchCategories();
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };
}

// Function to delete a category
async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`/api/categories/deleteCategory/${categoryId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            fetchCategories();
        } else {
            const errorData = await response.json();
            if (response.status === 400 && errorData.message.includes('associated')) {
                displayErrorMessage("This category cannot be deleted because it's associated with products.");
            } else {
                displayErrorMessage("This category cannot be deleted because it's associated with products.");
            }
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        displayErrorMessage("This category cannot be deleted because it's associated with products.");
    }
}

function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    let errorContainer = document.getElementById('error-message-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-message-container';
        document.body.appendChild(errorContainer);
    }

    // Create and style the error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    // Add the error message to the container
    errorContainer.appendChild(errorElement);

    // Style the error message
    Object.assign(errorElement.style, {
        backgroundColor: '#ffebee',
        color: '#d32f2f',
        padding: '10px 15px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ef9a9a',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    });

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#d32f2f';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => errorElement.remove();

    errorElement.appendChild(closeButton);

    // Automatically remove the error message after 5 seconds
    setTimeout(() => {
        errorElement.style.opacity = '0';
        errorElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => errorElement.remove(), 500);
    }, 5000);
}

// Function to filter products by category
function filterProductsByCategory(categoryId) {
    if (categoryId === null) {
        fetchProducts(currentPage);
    } else {
        const filteredProducts = products.filter(product => product.category.categoryId === categoryId);
        renderFilteredProducts(filteredProducts);
    }
}

// Function to render filtered products
function renderFilteredProducts(filteredProducts) {
    const productDisplay = document.querySelector('.product-display');
    productDisplay.innerHTML = '';
    if (filteredProducts.length === 0) {
        productDisplay.innerHTML = '<p>No products found.</p>';
    } else {
        filteredProducts.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-tile';
            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <p>Stock: ${product.stock}</p>
            `;
            div.addEventListener('click', () => showProductDetails(product));
            productDisplay.appendChild(div);
        });
    }
}

// Function to handle search
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
        
    );
    renderFilteredProducts(filteredProducts);
}

// Function to show add category form
function showAddCategoryForm() {
    const modal = document.getElementById('addCategoryModal');
    modal.style.display = 'block';
}

// Function to add a new category
async function addCategory(event) {
    // Prevent the default form submission
    if (event) event.preventDefault();

    // Get the value from the input field
    const categoryName = document.getElementById('newCategoryName').value;

    if (!categoryName.trim()) {
        displayErrorMessage("Category name cannot be empty.");
        return;
    }

    // Create a CategoryModel object
    const categoryModel = {
        categoryName: categoryName
        // Add other properties of CategoryModel if needed, e.g.:
        // categoryId: null  // Assuming the ID is generated by the backend
    };

    try {
        const response = await fetch('/api/categories/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryModel),
        });
       
        if (response.ok) {
            const savedCategory = await response.json();
            document.getElementById('addCategoryModal').style.display = 'none';
            document.getElementById('newCategoryName').value = '';
            fetchCategories();
            console.log('Category added successfully:', savedCategory);
        } else {
            const errorData = await response.json();
            displayErrorMessage(errorData.message || "Error adding category.");
        }
    } catch (error) {
        console.error('Error adding category:', error);
        displayErrorMessage("An error occurred while adding the category.");
    }
}