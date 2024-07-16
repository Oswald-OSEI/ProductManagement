package product.management.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import product.management.entity.CategoryEntity;
import product.management.model.CategoryModel;
import product.management.repository.CategoryRepository;

@Service

public class CategoryService{
    @Autowired
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    //Fetch all categories from database
    public List<CategoryModel> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::convertToModel)
                .collect(Collectors.toList());
    }

    //Create a new category
    public CategoryModel save(CategoryModel model){
        CategoryEntity category = convertToEntity(model);
        category = categoryRepository.save(category);
        return convertToModel(category);
    }

    //Find category using its id
    public CategoryEntity findCategoryById(Long id){
        CategoryEntity category = categoryRepository.findById(id).orElseThrow(()->new RuntimeException("Category not found"));
        return category;
    }

    //Delete category
    public void deleteById(Long id){
        categoryRepository.deleteById(id);
    }

    //Convert entity fetched from database to model parameters for frontend
    public CategoryModel convertToModel(CategoryEntity entity) {
        return new CategoryModel(entity.getCategoryId(), entity.getCategoryName());
    }

    //Convert model data from front end to entity parameters for the database
    public CategoryEntity convertToEntity(CategoryModel model){
        return new CategoryEntity(model.getCategoryId(),model.getCategoryName());
    }
}