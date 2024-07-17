package product.management.service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import product.management.entity.CategoryEntity;
import product.management.entity.ProductEntity;
import product.management.model.CategoryModel;
import product.management.model.ProductModel;
import product.management.repository.ProductRepository;


@Service
public class ProductService {

    @Autowired
    private final ProductRepository productRepository;

    @Autowired CategoryService categoryService;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public Page<ProductModel> findAll(Pageable pageable) {
        Page<ProductEntity> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToProductModel);
    }

    @Transactional
    public ProductModel save(ProductModel productModel){
        CategoryEntity category = categoryService.findCategoryById(productModel.getCategory().getCategoryId());
        ProductEntity productEntity = convertToAddProductEntity(productModel);
        productEntity.setCategory(category);
        productRepository.save(productEntity);
        return convertToProductModel(productEntity);
    }

    //Edit Product
    public ProductModel edit(ProductModel productModel){
        System.out.println(productModel.getId());
        ProductEntity productEntity = convertToProductEntity(findById(productModel.getId()));
        productEntity.setName(productModel.getName());
        System.out.println(productEntity.getId());
        productEntity.setPrice(productModel.getPrice());
        productEntity.setDescription(productModel.getDescription());
        productEntity.setStock(productModel.getStock());
        productEntity.setCategory(categoryService.convertToEntity(productModel.getCategory()));
        productEntity = productRepository.save(productEntity);
        return convertToProductModel(productEntity);
    }


    public void deleteById(Long id){
        productRepository.deleteById(id);
    }

    public ProductModel findById(Long id){
        Optional<ProductEntity> productEntity = productRepository.findById(id);
        return productEntity.map(this::convertToProductModel).orElseThrow(()-> new RuntimeException("Product not found"));
    }

    private ProductEntity convertToProductEntity(ProductModel productModel) {
        ProductEntity productEntity = new ProductEntity(
                categoryService.convertToEntity(productModel.getCategory()),
                productModel.getName(),
                productModel.getPrice(),
                productModel.getDescription(),
                productModel.getStock()
        );
        productEntity.setId(productModel.getId());
        return productEntity;
    }
    private ProductEntity convertToAddProductEntity(ProductModel productModel) {
        ProductEntity productEntity = new ProductEntity(
                categoryService.convertToEntity(productModel.getCategory()),
                productModel.getName(),
                productModel.getPrice(),
                productModel.getDescription(),
                productModel.getStock()
        );
        
        return productEntity;
    }

    public ProductModel convertToProductModel(ProductEntity productEntity){
        ProductModel productModel = new ProductModel();
        productModel.setId(productEntity.getId());
        productModel.setName(productEntity.getName());
        productModel.setDescription(productEntity.getDescription());
        productModel.setPrice(productEntity.getPrice());
        productModel.setStock(productEntity.getStock());
        productModel.setCategory(categoryService.convertToModel(productEntity.getCategory()));
        return productModel;
    }
}