import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed script for L'Artisan Baking Atelier
 * 
 * Creates initial data:
 * - Admin user
 * - Product categories
 * - Sample products
 */

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================
  // 1. Create Admin User
  // ============================================
  console.log('👤 Creating admin user...');
  
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@artisan.com' },
    update: {},
    create: {
      email: 'admin@artisan.com',
      name: 'Master Baker',
      hashedPassword: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  
  console.log(`✅ Admin user created: ${admin.email}\n`);

  // ============================================
  // 2. Create Categories
  // ============================================
  console.log('📂 Creating categories...');
  
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'sourdough' },
      update: {},
      create: {
        name: 'Sourdough',
        slug: 'sourdough',
        description: 'Naturally leavened artisan breads with complex flavors and textures',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'patisserie' },
      update: {},
      create: {
        name: 'Pâtisserie',
        slug: 'patisserie',
        description: 'French pastries and delicate desserts crafted with precision',
        image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'viennoiserie' },
      update: {},
      create: {
        name: 'Viennoiserie',
        slug: 'viennoiserie',
        description: 'Laminated doughs and breakfast pastries with buttery layers',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
        sortOrder: 3,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories:`);
  categories.forEach(cat => console.log(`   - ${cat.name}`));
  console.log();

  // Create category slug map for reference
  const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

  // ============================================
  // 3. Create Products
  // ============================================
  console.log('🥐 Creating products...\n');

  const products = await Promise.all([
    // Sourdough Products
    prisma.product.upsert({
      where: { sku: 'SD-001' },
      update: {},
      create: {
        name: 'Country Sourdough',
        slug: 'country-sourdough',
        description: 'Naturally fermented for 24 hours with organic wheat flour. Crispy crust with beautiful blistering, open crumb structure with irregular holes. Mild tang with complex wheat flavor.',
        shortDescription: 'Naturally fermented artisan sourdough with crispy crust and open crumb',
        price: 12.00,
        compareAtPrice: 15.00,
        gstRate: 0.09,
        sku: 'SD-001',
        stockQuantity: 25,
        lowStockThreshold: 5,
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80',
          'https://images.unsplash.com/photo-1585478259715-876acc5be8fc?w=1200&q=80',
        ],
        weight: 0.8,
        isAvailable: true,
        isFeatured: true,
        isDigital: false,
        categoryId: categoryMap.get('sourdough'),
        metaTitle: 'Country Sourdough | L\'Artisan Baking Atelier',
        metaDescription: 'Authentic naturally fermented sourdough bread with 24-hour fermentation',
      },
    }),

    prisma.product.upsert({
      where: { sku: 'SD-002' },
      update: {},
      create: {
        name: 'Olive & Herb Sourdough',
        slug: 'olive-herb-sourdough',
        description: 'Mediterranean-inspired sourdough studded with Kalamata olives, rosemary, and thyme. A savory loaf perfect for pairing with cheeses and wines.',
        shortDescription: 'Mediterranean sourdough with olives and fresh herbs',
        price: 16.50,
        gstRate: 0.09,
        sku: 'SD-002',
        stockQuantity: 15,
        lowStockThreshold: 3,
        images: [
          'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1200&q=80',
        ],
        weight: 0.85,
        isAvailable: true,
        isFeatured: false,
        isDigital: false,
        categoryId: categoryMap.get('sourdough'),
      },
    }),

    // Pâtisserie Products
    prisma.product.upsert({
      where: { sku: 'PT-001' },
      update: {},
      create: {
        name: 'Assorted Macarons (6 pieces)',
        slug: 'assorted-macarons',
        description: 'Delicate almond meringue shells with smooth ganache and buttercream fillings. Each box contains six flavors: Pistachio, Raspberry, Chocolate, Lemon, Salted Caramel, and Vanilla.',
        shortDescription: 'Six-piece assorted French macarons in classic flavors',
        price: 28.00,
        compareAtPrice: 32.00,
        gstRate: 0.09,
        sku: 'PT-001',
        stockQuantity: 20,
        lowStockThreshold: 5,
        images: [
          'https://images.unsplash.com/photo-1612203985729-70726954388c?w=1200&q=80',
          'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=1200&q=80',
        ],
        weight: 0.15,
        isAvailable: true,
        isFeatured: true,
        isDigital: false,
        categoryId: categoryMap.get('patisserie'),
        metaTitle: 'Assorted Macarons | L\'Artisan Baking Atelier',
        metaDescription: 'Handcrafted French macarons in six delicious flavors',
      },
    }),

    prisma.product.upsert({
      where: { sku: 'PT-002' },
      update: {},
      create: {
        name: 'Chocolate Ganache Tart',
        slug: 'chocolate-ganache-tart',
        description: 'Silky dark chocolate ganache in a buttery pâte sablée shell, finished with edible gold leaf and fresh raspberries. A decadent dessert for special occasions.',
        shortDescription: 'Decadent dark chocolate tart with gold leaf finish',
        price: 42.00,
        gstRate: 0.09,
        sku: 'PT-002',
        stockQuantity: 8,
        lowStockThreshold: 2,
        images: [
          'https://images.unsplash.com/photo-1515037028865-0a2a82603f7c?w=1200&q=80',
        ],
        weight: 0.6,
        isAvailable: true,
        isFeatured: true,
        isDigital: false,
        categoryId: categoryMap.get('patisserie'),
      },
    }),

    prisma.product.upsert({
      where: { sku: 'PT-003' },
      update: {},
      create: {
        name: 'Classic Éclair (3 pieces)',
        slug: 'classic-eclairs',
        description: 'Traditional choux pastry filled with vanilla bean crème pâtissière and topped with glossy dark chocolate fondant. Made fresh daily.',
        shortDescription: 'Traditional French éclairs with vanilla cream',
        price: 18.00,
        gstRate: 0.09,
        sku: 'PT-003',
        stockQuantity: 12,
        lowStockThreshold: 3,
        images: [
          'https://images.unsplash.com/photo-1612203985729-70726954388c?w=1200&q=80',
        ],
        weight: 0.2,
        isAvailable: true,
        isFeatured: false,
        isDigital: false,
        categoryId: categoryMap.get('patisserie'),
      },
    }),

    // Viennoiserie Products
    prisma.product.upsert({
      where: { sku: 'VN-001' },
      update: {},
      create: {
        name: 'Butter Croissant',
        slug: 'butter-croissant',
        description: 'Laminated with premium French butter, our croissants have 27 delicate layers that bake to golden perfection. Flaky exterior, tender honeycomb interior.',
        shortDescription: '27-layer laminated croissant with premium French butter',
        price: 4.50,
        compareAtPrice: 5.50,
        gstRate: 0.09,
        sku: 'VN-001',
        stockQuantity: 50,
        lowStockThreshold: 10,
        images: [
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80',
          'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=1200&q=80',
        ],
        weight: 0.07,
        isAvailable: true,
        isFeatured: true,
        isDigital: false,
        categoryId: categoryMap.get('viennoiserie'),
        metaTitle: 'Butter Croissant | L\'Artisan Baking Atelier',
        metaDescription: 'Authentic French croissant with 27 layers of lamination',
      },
    }),

    prisma.product.upsert({
      where: { sku: 'VN-002' },
      update: {},
      create: {
        name: 'Pain au Chocolat',
        slug: 'pain-au-chocolat',
        description: 'Buttery laminated dough wrapped around two batons of dark chocolate. The perfect balance of crisp pastry and molten chocolate center.',
        shortDescription: 'Classic French pastry with dark chocolate batons',
        price: 5.50,
        gstRate: 0.09,
        sku: 'VN-002',
        stockQuantity: 35,
        lowStockThreshold: 7,
        images: [
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80',
        ],
        weight: 0.08,
        isAvailable: true,
        isFeatured: true,
        isDigital: false,
        categoryId: categoryMap.get('viennoiserie'),
      },
    }),

    prisma.product.upsert({
      where: { sku: 'VN-003' },
      update: {},
      create: {
        name: 'Almond Croissant',
        slug: 'almond-croissant',
        description: 'Day-old croissants filled with rich almond frangipane, topped with sliced almonds and dusted with powdered sugar. Baked until golden and fragrant.',
        shortDescription: 'Twice-baked croissant with almond frangipane filling',
        price: 6.00,
        gstRate: 0.09,
        sku: 'VN-003',
        stockQuantity: 20,
        lowStockThreshold: 5,
        images: [
          'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=1200&q=80',
        ],
        weight: 0.09,
        isAvailable: true,
        isFeatured: false,
        isDigital: false,
        categoryId: categoryMap.get('viennoiserie'),
      },
    }),

    prisma.product.upsert({
      where: { sku: 'VN-004' },
      update: {},
      create: {
        name: 'Cinnamon Danish',
        slug: 'cinnamon-danish',
        description: 'Laminated dough spiraled with cinnamon sugar and vanilla bean cream cheese. Topped with lemon glaze for the perfect sweet-tangy balance.',
        shortDescription: 'Laminated pastry with cinnamon and cream cheese',
        price: 5.00,
        gstRate: 0.09,
        sku: 'VN-004',
        stockQuantity: 18,
        lowStockThreshold: 4,
        images: [
          'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80',
        ],
        weight: 0.08,
        isAvailable: true,
        isFeatured: false,
        isDigital: false,
        categoryId: categoryMap.get('viennoiserie'),
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products:`);
  products.forEach(prod => {
    const category = categories.find(c => c.id === prod.categoryId);
    console.log(`   - ${prod.name} (${prod.sku}) - $${prod.price} - ${category?.name || 'No category'}`);
  });
  console.log();

  // ============================================
  // Seed Complete
  // ============================================
  console.log('🎉 Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   • 1 Admin user`);
  console.log(`   • ${categories.length} Categories`);
  console.log(`   • ${products.length} Products`);
  console.log();
  console.log('🔑 Admin Credentials:');
  console.log('   Email: admin@artisan.com');
  console.log('   Password: Admin@123456');
  console.log();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
