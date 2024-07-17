// Global variables
let categories = [];
let products = [];
let currentPage = 1;
const productsPerPage = 15;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();

    document.querySelector('.add-product-btn').addEventListener('click', showAddProductForm);
    document.getElementById('applyChangesBtn').addEventListener('click', editProduct);
    document.getElementById('addNewProductBtn').addEventListener('click', addProduct);
    document.getElementById('searchInput').addEventListener('input', handleSearch);

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
async function fetchProducts(page = 1) {
    try {
        const response = await fetch(`/api/products?page=${page - 1}&size=${productsPerPage}`);
        const data = await response.json();
        products = data;
        renderProducts();
        renderPagination();
        document.getElementById('searchInput').value = '';
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
    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(products.length / productsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            fetchProducts(currentPage);
        });
        paginationDiv.appendChild(button);
    }
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
    const price = document.getElementById('newProductPrice').value;
    const stock = document.getElementById('newProductStock').value;
    const description = document.getElementById('newProductDescription').value;
    const categoryId = document.getElementById('newProductCategory').value;

    try {
        const response = await fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                stock,
                description,
                category: { categoryId }
            }),
        });
        if (response.ok) {
            document.getElementById('addProductModal').style.display = 'none';
            fetchProducts(currentPage);
        }
    } catch (error) {
        console.error('Error adding product:', error);
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
async function deleteCategory(id) {
    try {
        const response = await fetch(`/api/categories/deleteCategory/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchCategories();
        }
    } catch (error) {
        console.error('Error deleting category:', error);
    }
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
    const searchTerm = document.getElementById('searchInput').value;
    const filteredProducts = products.filter(product => 
        product.name.includes(searchTerm)
        
    );
    renderFilteredProducts(filteredProducts);
}