package product.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import product.management.entity.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity, Long>{
} 