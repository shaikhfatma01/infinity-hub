import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MOCK_PRODUCTS } from '../data/mockProducts.js';
import { MOCK_SHOPPING_MISSIONS } from '../data/mockMissions.js';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // 1. Seed or update demo user
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'fatma.shaikh@infinityhub.ai' },
    update: {
      name: 'Fatma Shaikh',
      role: 'PRO_MEMBER',
    },
    create: {
      email: 'fatma.shaikh@infinityhub.ai',
      passwordHash: hashedPassword,
      name: 'Fatma Shaikh',
      role: 'PRO_MEMBER',
    },
  });
  console.log(`👤 Demo user created/updated: ${demoUser.email}`);

  // 2. Seed all products
  for (const p of MOCK_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        productGroupId: p.productGroupId,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subCategory: p.subCategory,
        description: p.description,
        image: p.image,
        galleryImagesJson: JSON.stringify(p.galleryImages || [p.image]),
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        shippingFee: p.shippingFee,
        finalEstimatedPrice: p.finalEstimatedPrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        deliveryEstimate: p.deliveryEstimate,
        deliveryDays: p.deliveryDays,
        store: p.store,
        inStock: p.inStock,
        seller: p.seller,
        sellerTrust: p.sellerTrust,
        sellerTrustScore: p.sellerTrustScore,
        returnPolicy: p.returnPolicy,
        warranty: p.warranty,
        infinityScore: p.infinityScore,
        infinityScoreBreakdown: JSON.stringify(p.infinityScoreBreakdown),
        dealStatus: p.dealStatus,
        dealAnalysisText: p.dealAnalysisText,
        recentAveragePrice: p.recentAveragePrice,
        lowestRecordedPrice: p.lowestRecordedPrice,
        highestRecordedPrice: p.highestRecordedPrice,
        priceHistory: JSON.stringify(p.priceHistory),
        buyRecommendation: p.buyRecommendation,
        buyRecommendationReason: p.buyRecommendationReason,
        aiReviewSummary: JSON.stringify(p.aiReviewSummary),
        ecoScore: p.ecoScore,
        ecoFactors: JSON.stringify(p.ecoFactors),
        specs: JSON.stringify(p.specs),
        tags: JSON.stringify(p.tags),
        unitPriceText: p.unitPriceText || null,
        unitPriceValue: p.unitPriceValue || null,
        unitType: p.unitType || null,
        twinOffers: p.twinOffers ? JSON.stringify(p.twinOffers) : null,
        compatibleItems: p.compatibleItems ? JSON.stringify(p.compatibleItems) : null,
      },
      create: {
        id: p.id,
        productGroupId: p.productGroupId,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subCategory: p.subCategory,
        description: p.description,
        image: p.image,
        galleryImagesJson: JSON.stringify(p.galleryImages || [p.image]),
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        shippingFee: p.shippingFee,
        finalEstimatedPrice: p.finalEstimatedPrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        deliveryEstimate: p.deliveryEstimate,
        deliveryDays: p.deliveryDays,
        store: p.store,
        inStock: p.inStock,
        seller: p.seller,
        sellerTrust: p.sellerTrust,
        sellerTrustScore: p.sellerTrustScore,
        returnPolicy: p.returnPolicy,
        warranty: p.warranty,
        infinityScore: p.infinityScore,
        infinityScoreBreakdown: JSON.stringify(p.infinityScoreBreakdown),
        dealStatus: p.dealStatus,
        dealAnalysisText: p.dealAnalysisText,
        recentAveragePrice: p.recentAveragePrice,
        lowestRecordedPrice: p.lowestRecordedPrice,
        highestRecordedPrice: p.highestRecordedPrice,
        priceHistory: JSON.stringify(p.priceHistory),
        buyRecommendation: p.buyRecommendation,
        buyRecommendationReason: p.buyRecommendationReason,
        aiReviewSummary: JSON.stringify(p.aiReviewSummary),
        ecoScore: p.ecoScore,
        ecoFactors: JSON.stringify(p.ecoFactors),
        specs: JSON.stringify(p.specs),
        tags: JSON.stringify(p.tags),
        unitPriceText: p.unitPriceText || null,
        unitPriceValue: p.unitPriceValue || null,
        unitType: p.unitType || null,
        twinOffers: p.twinOffers ? JSON.stringify(p.twinOffers) : null,
        compatibleItems: p.compatibleItems ? JSON.stringify(p.compatibleItems) : null,
      },
    });
  }
  console.log(`📦 Seeded ${MOCK_PRODUCTS.length} products with Product Twin data.`);

  // 3. Seed shopping missions
  for (const m of MOCK_SHOPPING_MISSIONS) {
    await prisma.shoppingMission.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        icon: m.icon,
        tagline: m.tagline,
        targetBudget: m.targetBudget,
        description: m.description,
        category: m.category,
        itemsJson: JSON.stringify(m.items),
        tipsJson: JSON.stringify(m.tips),
      },
      create: {
        id: m.id,
        title: m.title,
        icon: m.icon,
        tagline: m.tagline,
        targetBudget: m.targetBudget,
        description: m.description,
        category: m.category,
        itemsJson: JSON.stringify(m.items),
        tipsJson: JSON.stringify(m.tips),
      },
    });
  }
  console.log(`🎓 Seeded ${MOCK_SHOPPING_MISSIONS.length} shopping missions.`);

  // 4. Seed demo shared list if empty
  const existingSharedList = await prisma.sharedList.findFirst();
  if (!existingSharedList) {
    const list = await prisma.sharedList.create({
      data: {
        name: 'Family Grocery & Essentials',
        createdBy: 'Fatma Shaikh',
        items: {
          create: [
            {
              name: 'Daawat Rozana Gold Basmati Rice (5kg)',
              addedBy: 'Fatma',
              category: 'Grocery',
              matchedProductId: 'prod-rice-bigbasket',
              quantity: 1,
              isPurchased: false,
            },
            {
              name: 'Fortune Sunlite Sunflower Oil (1L)',
              addedBy: 'Amina',
              category: 'Grocery',
              matchedProductId: 'prod-oil-blinkit',
              quantity: 2,
              isPurchased: false,
            },
            {
              name: 'Wakefit 500 GSM Double Mink Blanket',
              addedBy: 'Mom',
              category: 'Bedding & Blankets',
              matchedProductId: 'prod-blanket-flipkart',
              quantity: 1,
              isPurchased: true,
            },
          ],
        },
      },
    });
    console.log(`👨‍👩‍👧 Seeded default shared list: ${list.name}`);
  }

  // 5. Seed initial cart items for demo user if none exist
  const existingCart = await prisma.cartItem.findFirst({ where: { userId: demoUser.id } });
  if (!existingCart) {
    await prisma.cartItem.createMany({
      data: [
        {
          userId: demoUser.id,
          productId: 'prod-purse-amazon',
          selectedStore: 'Amazon',
          selectedPrice: 999,
          selectedShipping: 40,
          quantity: 1,
        },
        {
          userId: demoUser.id,
          productId: 'prod-skincare-nykaa',
          selectedStore: 'Nykaa',
          selectedPrice: 429,
          selectedShipping: 0,
          quantity: 1,
        },
        {
          userId: demoUser.id,
          productId: 'prod-shoes-myntra',
          selectedStore: 'Myntra',
          selectedPrice: 4599,
          selectedShipping: 0,
          quantity: 1,
        },
      ],
    });
    console.log('🛒 Seeded initial demo user cart items.');
  }

  console.log('✅ Database seed completed successfully!');
}

// Execute when run directly
if (process.argv[1]?.includes('seed')) {
  seedDatabase()
    .catch((err) => {
      console.error('❌ Error during seed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
