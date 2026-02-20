# 🏭 Royal Jeans - ساختار جدید دیتابیس
## New Database Structure & Backend Adaptation Plan

---

## 📋 مشکلات ساختار فعلی

### 1. جدول Orders بیش از حد گسترده (84 فیلد)
- سایزها و دسته‌بندی‌ها به صورت هاردکد (`size30_healthy`, `size31_healthy`...)
- اضافه کردن سایز یا دسته جدید نیاز به تغییر ساختار دارد
- نگهداری و توسعه بسیار سخت

### 2. عدم وجود سیستم گردش کار (Workflow)
- سفارشات مراحل مختلفی دارند: پارچه → دوخت → سنگ‌شویی → بسته‌بندی
- فعلی فقط مقادیر موجودی ذخیره می‌شود، نه وضعیت مرحله‌ای

### 3. عدم ارتباط مناسب با پیمانکاران
- فقط نام پیمانکار به صورت String ذخیره می‌شود
- امکان رهگیری تاریخچه کار با پیمانکار وجود ندارد

### 4. عدم وجود سیستم انبارداری واقعی
- فقط موجودی لحظه‌ای ذخیره می‌شود
- ورود/خروج کالا ثبت نمی‌شود

### 5. عدم تفکیک محصولات
- هر سفارش = یک محصول (در حالی که یک سفارش می‌تواند چند محصول داشته باشد)

---

## ✅ خلاصه بهبودهای اعمال شده

بر اساس بازخوردها، این بهبودها اعمال شد:

| مورد | تغییر |
|------|-------|
| **OrderItemSize** | حذف `sizeCategoryId` (redundant) - فقط `sizeId` نگه داشته شد |
| **Workflow** | تغییر از `orderId` به `orderItemId` - هر آیتم مراحل متفاوت دارد |
| **Inventory** | تفکیک به `ProductInventory` و `MaterialInventory` - بدون nullable |
| **Material Stock** | حذف `currentStock` - محاسبه از طریق View |
| **Contractor Rating** | حذف فیلد `rating` - محاسبه از میانگین evaluations |
| **StageHistory** | تغییر `action` از String به Enum (`StageAction`) |
| **Payments** | اضافه شدن جدول `Payment` برای رهگیری چک و اقساط |

---

## 🏗 ساختار جدید دیتابیس

### ERD کلی

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Users       │     │     Roles       │     │  Permissions    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ email           │◄────┤ name            │     │ name            │
│ password        │     │ description     │     │ resource        │
│ roleId (FK)     │────►┤ isActive        │◄────┤ action          │
│ profile         │     │ createdAt       │     │ roleId (FK)     │
│ createdAt       │     └─────────────────┘     └─────────────────┘
└─────────────────┘
         │
         │ creates
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Orders      │────►│   OrderItems    │────►│  OrderItemSizes │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ orderNumber     │     │ orderId (FK)    │     │ orderItemId(FK) │
│ customerName    │     │ productId (FK)  │────►┤ sizeCategoryId  │
│ orderDate       │     │ quantity        │     │ sizeId (FK)     │
│ deliveryDate    │     │ unitPrice       │     │ quantity        │
│ status          │     │ notes           │     │ producedQty     │
│ priority        │     │ createdAt       │     │ packedQty       │
│ totalAmount     │     └─────────────────┘     └─────────────────┘
│ createdBy (FK)  │              │
│ createdAt       │              │
└─────────────────┘              │ uses
         │                       ▼
         │              ┌─────────────────┐
         │              │    Products     │
         │              ├─────────────────┤
         │              │ id (PK)         │
         │              │ code            │
         │              │ name            │
         │              │ categoryId (FK) │
         │              │ styleId (FK)    │
         │              │ fabricId (FK)   │
         │              │ isActive        │
         │              └─────────────────┘
         │
         │ has
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ OrderItemWorkflow│    │ WorkflowStages  │     │  StageHistory   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ orderItemId(FK) │────►┤ name            │◄────┤ workflowId (FK) │
│ stageId (FK)    │────►┤ order           │     │ action (enum)   │
│ contractorId(FK)│     │ isActive        │     │ contractorId(FK)│
│ status          │     │ description     │     │ quantity        │
│ startDate       │     └─────────────────┘     │ createdAt       │
│ endDate         │                             └─────────────────┘
│ notes           │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     Payment     │     │  ProductInventory│
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ orderId (FK)    │◄────┤ productId (FK)  │
│ amount          │     │ type (enum)     │
│ type (enum)     │     │ quantity        │
│ status (enum)   │     │ warehouseId(FK) │
│ paidAt          │     │ createdAt       │
│ dueDate         │     └─────────────────┘
└─────────────────┘

┌─────────────────┐
│ MaterialInventory│
├─────────────────┤
│ id (PK)         │
│ materialId (FK) │
│ type (enum)     │
│ quantity        │
│ warehouseId(FK) │
│ expiryDate      │
│ createdAt       │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Contractors    │     │ ContractorTypes │     │  Evaluations    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ name            │     │ name            │     │ contractorId(FK)│
│ typeId (FK)     │────►┤ slug            │◄────┤ evaluatedBy(FK) │
│ phone           │     │ description     │     │ criteriaId (FK) │
│ address         │     └─────────────────┘     │ score           │
│ isActive        │                             │ comments        │
│ rating (comp.)  │                             │ createdAt       │
└─────────────────┘                             └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   Inventory     │     │ InventoryTypes  │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ type (IN/OUT)   │     │ name            │
│ productId (FK)  │────►┤ category        │
│ quantity        │     │ unit            │
│ referenceType   │     │ minStock        │
│ referenceId     │     │ maxStock        │
│ notes           │     └─────────────────┘
│ createdBy (FK)  │
│ createdAt       │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  SizeCategories │     │     Sizes       │     │  ProductSizes   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────┤ categoryId (FK) │     │ productId (FK)  │
│ name            │     │ id (PK)         │     │ sizeId (FK)     │
│ slug            │     │ name            │     │ isActive        │
│ displayOrder    │     │ displayOrder    │     └─────────────────┘
│ isActive        │     │ isActive        │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   AuditLogs     │     │    Settings     │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ userId (FK)     │     │ key             │
│ action          │     │ value           │
│ entityType      │     │ group           │
│ entityId        │     │ isEditable      │
│ oldValues (JSON)│     │ createdAt       │
│ newValues (JSON)│     │ updatedAt       │
│ ipAddress       │     └─────────────────┘
│ createdAt       │
└─────────────────┘
```

---

## 📊 جزئیات جداول جدید

### 1. Users (بازنگری شده)
```prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  password      String
  
  // Profile Info
  firstName     String?
  lastName      String?
  nickname      String?   // نام مستعار
  avatar        String?
  phone         String?
  bio           String?
  
  // Role & Status
  roleId        Int
  role          Role      @relation(fields: [roleId], references: [id])
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  
  // Relations
  orders        Order[]
  orderWorkflows OrderWorkflow[]
  evaluations   ContractorEvaluation[]
  auditLogs     AuditLog[]
  inventoryLogs Inventory[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
  @@index([roleId])
  @@index([isActive])
}

model Role {
  id          Int          @id @default(autoincrement())
  name        String       @unique
  slug        String       @unique
  description String?
  isActive    Boolean      @default(true)
  
  users       User[]
  permissions Permission[]
  
  createdAt   DateTime     @default(now())
}

model Permission {
  id       Int    @id @default(autoincrement())
  roleId   Int
  role     Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)
  resource String // 'orders', 'contractors', 'reports'
  action   String // 'create', 'read', 'update', 'delete'
  
  @@unique([roleId, resource, action])
  @@index([roleId])
}
```

**تغییرات:**
- تفکیک نام به firstName و lastName
- سیستم نقش و دسترسی پیشرفته‌تر
- امکان تعریف دسترسی دقیق برای هر نقش

---

### 2. Orders & OrderItems (بازنگری اساسی)
```prisma
model Order {
  id              Int           @id @default(autoincrement())
  orderNumber     String        @unique
  customerName    String
  customerPhone   String?
  
  // Dates
  orderDate       DateTime      @default(now())
  deliveryDate    DateTime?
  completedAt     DateTime?
  
  // Status & Priority
  status          OrderStatus   @default(PENDING)
  priority        Priority      @default(NORMAL)
  
  // Financial
  totalAmount     Decimal       @default(0)
  paidAmount      Decimal       @default(0)
  discountAmount  Decimal       @default(0)
  
  // Notes
  description     String?
  internalNotes   String?
  
  // Relations
  items           OrderItem[]
  payments        Payment[]
  
  createdBy       Int
  creator         User          @relation(fields: [createdBy], references: [id])
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([orderNumber])
  @@index([status])
  @@index([orderDate])
  @@index([customerName])
}

model OrderItem {
  id              Int               @id @default(autoincrement())
  orderId         Int
  order           Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId       Int
  product         Product           @relation(fields: [productId], references: [id])
  
  // Quantity & Price
  quantity        Int
  unitPrice       Decimal
  totalPrice      Decimal
  
  // Size Breakdown
  sizes           OrderItemSize[]
  
  // Workflow tracking per item
  workflows       OrderItemWorkflow[]
  
  // Status
  status          ItemStatus        @default(PENDING)
  
  notes           String?
  createdAt       DateTime          @default(now())
  
  @@index([orderId])
  @@index([productId])
  @@index([status])
}

model OrderItemSize {
  id              Int           @id @default(autoincrement())
  orderItemId     Int
  orderItem       OrderItem     @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  
  // Size (includes category through Size → SizeCategory relation)
  sizeId          Int
  size            Size          @relation(fields: [sizeId], references: [id])
  
  // Quantities
  orderedQty      Int
  producedQty     Int           @default(0)
  packagedQty     Int           @default(0)
  deliveredQty    Int           @default(0)
  
  @@index([orderItemId])
  @@index([sizeId])
}

enum OrderStatus {
  PENDING         // در انتظار
  CONFIRMED       // تایید شده
  IN_PROGRESS     // در حال انجام
  READY           // آماده تحویل
  DELIVERED       // تحویل داده شده
  CANCELLED       // لغو شده
}

enum ItemStatus {
  PENDING
  FABRIC_READY
  IN_PRODUCTION
  IN_WASH
  IN_PACKAGING
  READY
  DELIVERED
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

---

### 2.1 Payment Tracking (جدید - رهگیری پرداخت‌ها)
```prisma
model Payment {
  id              Int           @id @default(autoincrement())
  
  orderId         Int
  order           Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  // Payment Details
  amount          Decimal
  type            PaymentType   // CASH, CHECK, TRANSFER, CARD
  
  // For checks
  checkNumber     String?
  checkBank       String?
  checkDueDate    DateTime?
  
  // Status
  status          PaymentStatus @default(PENDING)
  
  // Dates
  paidAt          DateTime?     // زمان پرداخت واقعی
  dueDate         DateTime?     // تاریخ سررسید (برای چک)
  
  // Reference
  referenceCode   String?       // شماره پیگیری/رسید
  
  // Notes
  notes           String?
  
  // Audit
  createdBy       Int
  creator         User          @relation(fields: [createdBy], references: [id])
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([orderId])
  @@index([status])
  @@index([dueDate])
  @@index([type])
}

enum PaymentType {
  CASH        // نقدی
  CHECK       // چک
  TRANSFER    // واریز/انتقال
  CARD        // کارتخوان
  CREDIT      // اعتباری
}

enum PaymentStatus {
  PENDING     // در انتظار
  PAID        // پرداخت شده
  BOUNCED     // برگشت خورده (چک)
  CANCELLED   // لغو شده
}
```

**مزایا:**
- سفارش می‌تواند چند محصول داشته باشد
- هر محصول می‌تواند چند سایز و دسته‌بندی داشته باشد
- رهگیری تعداد تولید، بسته‌بندی و تحویل برای هر سایز
- بدون limit در تعداد سایزها

---

### 3. Products (جدید)
```prisma
model Product {
  id              Int             @id @default(autoincrement())
  code            String          @unique
  name            String
  description     String?
  
  // Relations
  categoryId      Int?
  category        ProductCategory? @relation(fields: [categoryId], references: [id])
  
  styleId         Int?
  style           Style?           @relation(fields: [styleId], references: [id])
  
  fabricId        Int?
  fabric          Fabric?          @relation(fields: [fabricId], references: [id])
  
  // Available Sizes for this product
  availableSizes  ProductSize[]
  
  // Default Prices by Category
  prices          ProductPrice[]
  
  // Images
  images          ProductImage[]
  
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relations
  orderItems      OrderItem[]
  
  @@index([code])
  @@index([categoryId])
  @@index([isActive])
}

model ProductCategory {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  slug        String    @unique
  description String?
  isActive    Boolean   @default(true)
  
  products    Product[]
  
  createdAt   DateTime  @default(now())
}

model ProductSize {
  id          Int       @id @default(autoincrement())
  productId   Int
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  sizeId      Int
  size        Size      @relation(fields: [sizeId], references: [id])
  
  isActive    Boolean   @default(true)
  
  @@unique([productId, sizeId])
}

model ProductPrice {
  id              Int           @id @default(autoincrement())
  productId       Int
  product         Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  sizeCategoryId  Int
  sizeCategory    SizeCategory  @relation(fields: [sizeCategoryId], references: [id])
  
  price           Decimal
  effectiveFrom   DateTime      @default(now())
  effectiveTo     DateTime?
  
  isActive        Boolean       @default(true)
  
  @@index([productId])
  @@index([sizeCategoryId])
}

model ProductImage {
  id          Int       @id @default(autoincrement())
  productId   Int
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  url         String
  alt         String?
  isPrimary   Boolean   @default(false)
  sortOrder   Int       @default(0)
  
  createdAt   DateTime  @default(now())
  
  @@index([productId])
}
```

---

### 4. Size Management (بازنگری)
```prisma
model SizeCategory {
  id              Int               @id @default(autoincrement())
  name            String            @unique  // سالم، اقتصادی، نمونه، استوک
  slug            String            @unique  // healthy, economy-1, economy-2, economy-3, sample, stock
  displayOrder    Int               @default(0)
  isActive        Boolean           @default(true)
  description     String?
  
  // Relations
  sizes           Size[]
  orderItemSizes  OrderItemSize[]
  productPrices   ProductPrice[]
  
  createdAt       DateTime          @default(now())
  
  @@index([slug])
  @@index([displayOrder])
}

model Size {
  id              Int               @id @default(autoincrement())
  categoryId      Int
  category        SizeCategory      @relation(fields: [categoryId], references: [id])
  
  name            String            // 30, 31, 32...
  displayOrder    Int               @default(0)
  isActive        Boolean           @default(true)
  
  // Relations
  orderItemSizes  OrderItemSize[]
  productSizes    ProductSize[]
  
  @@unique([categoryId, name])
  @@index([categoryId])
}
```

**مزایا:**
- امکان اضافه کردن سایز یا دسته جدید بدون تغییر کد
- مرتب‌سازی نمایش سایزها
- غیرفعال کردن سایزهای خاص

---

### 5. Order Workflow (جدید - سیستم گردش کار)
```prisma
model OrderItemWorkflow {
  id              Int             @id @default(autoincrement())
  
  // Workflow per OrderItem (not Order) - each item can have different stages
  orderItemId     Int
  orderItem       OrderItem       @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  
  stageId         Int
  stage           WorkflowStage   @relation(fields: [stageId], references: [id])
  
  contractorId    Int?
  contractor      Contractor?     @relation(fields: [contractorId], references: [id])
  
  // Assignment
  assignedTo      Int?
  assignee        User?           @relation(fields: [assignedTo], references: [id])
  
  // Status
  status          WorkflowStatus  @default(PENDING)
  
  // Quantities
  quantityIn      Int             @default(0)
  quantityOut     Int             @default(0)
  quantityWaste   Int             @default(0)
  
  // Dates
  startDate       DateTime?
  endDate         DateTime?
  dueDate         DateTime?
  
  // Notes
  notes           String?
  internalNotes   String?
  
  // Relations
  history         StageHistory[]
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([orderItemId])
  @@index([stageId])
  @@index([contractorId])
  @@index([status])
  @@index([assignedTo])
}

model WorkflowStage {
  id              Int               @id @default(autoincrement())
  name            String            // پارچه، برش، دوخت، سنگ‌شویی، بسته‌بندی
  slug            String            @unique // fabric, cutting, sewing, wash, packaging
  displayOrder    Int               @default(0)
  description     String?
  
  // Stage Type
  type            StageType         // INTERNAL, EXTERNAL
  
  // Default contractor type for this stage
  defaultContractorTypeId Int?
  
  isActive        Boolean           @default(true)
  
  // Relations
  workflows       OrderWorkflow[]
  
  createdAt       DateTime          @default(now())
  
  @@index([slug])
  @@index([displayOrder])
}

model StageHistory {
  id              Int             @id @default(autoincrement())
  
  workflowId      Int
  workflow        OrderItemWorkflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  
  // What changed - using enum for type safety
  action          StageAction
  
  // Quantities
  quantity        Int?
  wasteQty        Int?
  
  // Contractor (if external)
  contractorId    Int?
  contractor      Contractor?     @relation(fields: [contractorId], references: [id])
  
  // Notes
  notes           String?
  
  createdBy       Int
  createdAt       DateTime        @default(now())
  
  @@index([workflowId])
  @@index([createdAt])
}

enum StageAction {
  STARTED         // شروع مرحله
  COMPLETED       // تکمیل مرحله
  TRANSFERRED     // انتقال به مرحله بعد
  WASTE_RECORDED  // ثبت ضایعات
  ON_HOLD         // توقف موقت
  RESUMED         // از سرگیری
  ASSIGNED        // تخصیص به شخص/پیمانکار
}

enum WorkflowStatus {
  PENDING         // در انتظار
  IN_PROGRESS     // در حال انجام
  COMPLETED       // تکمیل شده
  ON_HOLD         // متوقف شده
  CANCELLED       // لغو شده
}

enum StageType {
  INTERNAL        // انجام داخلی
  EXTERNAL        // برون‌سپاری
}
```

**قابلیت‌ها:**
- رهگیری هر سفارش در مراحل مختلف
- تخصیص به پیمانکار در هر مرحله
- ثبت ورودی/خروجی/ضایعات در هر مرحله
- تاریخچه کامل تغییرات

---

### 6. Contractors (بازنگری)
```prisma
model Contractor {
  id              Int               @id @default(autoincrement())
  name            String            @unique
  code            String?           @unique
  
  typeId          Int
  type            ContractorType    @relation(fields: [typeId], references: [id])
  
  // Contact Info
  phone           String?
  mobile          String?
  email           String?
  address         String?
  
  // Financial
  creditLimit     Decimal?
  paymentTerms    String?           // نقدی، چک 30 روزه...
  
  // Status
  isActive        Boolean           @default(true)
  // Note: rating is computed from evaluations, not stored directly
  
  // Notes
  notes           String?
  
  // Relations
  evaluations     ContractorEvaluation[]
  orderItemWorkflows OrderItemWorkflow[]
  stageHistories  StageHistory[]
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  @@index([typeId])
  @@index([isActive])
  @@index([code])
}

model ContractorType {
  id              Int               @id @default(autoincrement())
  name            String            @unique  // پارچه، تولیدی، بسته‌بندی، سنگ‌شویی
  slug            String            @unique  // fabric, production, packaging, stone-wash
  description     String?
  isActive        Boolean           @default(true)
  
  contractors     Contractor[]
  
  createdAt       DateTime          @default(now())
}

model EvaluationCriteria {
  id              Int                   @id @default(autoincrement())
  name            String                @unique
  slug            String                @unique
  description     String?
  weight          Int                   @default(1)  // وزن امتیاز
  isActive        Boolean               @default(true)
  
  evaluations     ContractorEvaluation[]
  
  createdAt       DateTime              @default(now())
}

model ContractorEvaluation {
  id              Int                 @id @default(autoincrement())
  
  contractorId    Int
  contractor      Contractor          @relation(fields: [contractorId], references: [id], onDelete: Cascade)
  
  criteriaId      Int
  criteria        EvaluationCriteria  @relation(fields: [criteriaId], references: [id])
  
  evaluatedBy     Int
  evaluator       User                @relation(fields: [evaluatedBy], references: [id])
  
  // Rating (1-5)
  score           Int
  
  // Related Order
  orderId         Int?
  
  comments        String?
  createdAt       DateTime            @default(now())
  
  @@index([contractorId])
  @@index([criteriaId])
  @@index([evaluatedBy])
  @@index([orderId])
}
```

**تغییرات:**
- تفکیک نوع پیمانکار به جدول جداگانه
- سیستم امتیازدهی چندمعیاره
- کد پیمانکار برای رهگیری
- اطلاعات مالی

---

### 7. Inventory (جدید - سیستم انبارداری)

جدول انبارداری به دو جدول جداگانه تقسیم شده تا nullable fields نداشته باشیم:

```prisma
// برای محصولات نهایی
model ProductInventory {
  id              Int               @id @default(autoincrement())
  
  // Reference
  referenceType   String            // ORDER, ADJUSTMENT, RETURN
  referenceId     Int
  
  // Movement Type
  type            InventoryType     // IN, OUT, ADJUSTMENT
  
  // Product (always present for ProductInventory)
  productId       Int
  product         Product           @relation(fields: [productId], references: [id])
  
  // Quantity
  quantity        Int
  unit            String            // piece
  
  // Location
  warehouseId     Int?
  warehouse       Warehouse?        @relation(fields: [warehouseId], references: [id])
  
  // Details
  batchNumber     String?
  
  notes           String?
  
  // Audit
  createdBy       Int
  creator         User              @relation(fields: [createdBy], references: [id])
  createdAt       DateTime          @default(now())
  
  @@index([referenceType, referenceId])
  @@index([productId])
  @@index([type])
  @@index([createdAt])
}

// برای مواد اولیه و ملزومات
model MaterialInventory {
  id              Int               @id @default(autoincrement())
  
  // Reference
  referenceType   String            // ORDER_WORKFLOW, PURCHASE, ADJUSTMENT, WASTE
  referenceId     Int
  
  // Movement Type
  type            InventoryType     // IN, OUT, ADJUSTMENT
  
  // Material (always present for MaterialInventory)
  materialId      Int
  material        Material          @relation(fields: [materialId], references: [id])
  
  // Quantity
  quantity        Int
  unit            String            // meter, kg, piece
  
  // Location
  warehouseId     Int?
  warehouse       Warehouse?        @relation(fields: [warehouseId], references: [id])
  
  // Details
  batchNumber     String?
  expiryDate      DateTime?
  
  notes           String?
  
  // Audit
  createdBy       Int
  creator         User              @relation(fields: [createdBy], references: [id])
  createdAt       DateTime          @default(now())
  
  @@index([referenceType, referenceId])
  @@index([materialId])
  @@index([type])
  @@index([createdAt])
}

model Warehouse {
  id              Int           @id @default(autoincrement())
  name            String
  code            String?       @unique
  address         String?
  isActive        Boolean       @default(true)
  
  productInventories  ProductInventory[]
  materialInventories MaterialInventory[]
  
  createdAt       DateTime      @default(now())
}

enum InventoryType {
  IN              // ورود
  OUT             // خروج
  ADJUSTMENT      // تنظیم موجودی
  RETURN          // برگشت
  WASTE           // ضایعات
}
```

---

### 8. Materials & Accessories (جدید)
```prisma
model Material {
  id              Int               @id @default(autoincrement())
  name            String
  code            String?           @unique
  
  typeId          Int
  type            MaterialType      @relation(fields: [typeId], references: [id])
  
  // Unit
  unit            String            // meter, kg, piece
  
  // Stock thresholds (not current stock - that's calculated from movements)
  minStock        Int               @default(0)
  maxStock        Int?              // برای هشدار موجودی بیش از حد
  
  // Pricing
  lastPrice       Decimal?
  
  isActive        Boolean           @default(true)
  
  // Relations
  suppliers       MaterialSupplier[]
  usages          MaterialUsage[]
  inventory       MaterialInventory[]
  
  // Note: currentStock should be calculated from MaterialInventory movements
  // Use a view or computed field instead of storing directly
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  @@index([typeId])
  @@index([code])
}

model MaterialType {
  id          Int         @id @default(autoincrement())
  name        String      @unique
  slug        String      @unique
  description String?
  isActive    Boolean     @default(true)
  
  materials   Material[]
  
  createdAt   DateTime    @default(now())
}

model MaterialSupplier {
  id              Int         @id @default(autoincrement())
  materialId      Int
  material        Material    @relation(fields: [materialId], references: [id], onDelete: Cascade)
  
  contractorId    Int
  contractor      Contractor  @relation(fields: [contractorId], references: [id])
  
  isDefault       Boolean     @default(false)
  price           Decimal?
  
  @@unique([materialId, contractorId])
}

model MaterialUsage {
  id              Int             @id @default(autoincrement())
  
  materialId      Int
  material        Material        @relation(fields: [materialId], references: [id])
  
  // Usage in
  referenceType   String          // ORDER_WORKFLOW, PRODUCT_BOM
  referenceId     Int
  
  quantity        Int
  unit            String
  
  notes           String?
  createdAt       DateTime        @default(now())
  
  @@index([materialId])
  @@index([referenceType, referenceId])
}
```

---

### 8.1 Views برای محاسبات (Computed Fields)

به جای ذخیره مستقیم موجودی، از View یا Stored Procedure استفاده کنید:

```sql
-- View برای محاسبه موجودی مواد اولیه
CREATE VIEW material_stock_view AS
SELECT 
  m.id AS materialId,
  m.name,
  m.code,
  m.minStock,
  m.maxStock,
  COALESCE(SUM(CASE 
    WHEN mi.type = 'IN' THEN mi.quantity 
    WHEN mi.type = 'OUT' THEN -mi.quantity 
    WHEN mi.type = 'ADJUSTMENT' THEN mi.quantity
    ELSE 0 
  END), 0) AS currentStock,
  CASE 
    WHEN COALESCE(SUM(CASE 
      WHEN mi.type = 'IN' THEN mi.quantity 
      WHEN mi.type = 'OUT' THEN -mi.quantity 
      WHEN mi.type = 'ADJUSTMENT' THEN mi.quantity
      ELSE 0 
    END), 0) <= m.minStock THEN 'LOW'
    WHEN m.maxStock IS NOT NULL AND COALESCE(SUM(CASE 
      WHEN mi.type = 'IN' THEN mi.quantity 
      WHEN mi.type = 'OUT' THEN -mi.quantity 
      WHEN mi.type = 'ADJUSTMENT' THEN mi.quantity
      ELSE 0 
    END), 0) >= m.maxStock THEN 'HIGH'
    ELSE 'OK'
  END AS stockStatus
FROM materials m
LEFT JOIN material_inventories mi ON m.id = mi.materialId
WHERE m.isActive = true
GROUP BY m.id, m.name, m.code, m.minStock, m.maxStock;

-- View برای امتیاز پیمانکار (میانگین ارزیابی‌ها)
CREATE VIEW contractor_rating_view AS
SELECT 
  c.id AS contractorId,
  c.name,
  COALESCE(AVG(ce.score), 0) AS averageRating,
  COUNT(ce.id) AS evaluationCount,
  COALESCE(AVG(CASE WHEN ce.createdAt >= DATE_SUB(NOW(), INTERVAL 3 MONTH) THEN ce.score END), 0) AS recentRating
FROM contractors c
LEFT JOIN contractor_evaluations ce ON c.id = ce.contractorId
WHERE c.isActive = true
GROUP BY c.id, c.name;
```

**در Prisma:**
```prisma
// برای استفاده از View در Prisma
// در migrate dev اول view ایجاد کنید، سپس:
model MaterialStockView {
  materialId    Int       @id
  name          String
  code          String?
  minStock      Int
  maxStock      Int?
  currentStock  Int
  stockStatus   String    // LOW, OK, HIGH
  
  @@map("material_stock_view")
}

model ContractorRatingView {
  contractorId      Int       @id
  name              String
  averageRating     Float
  evaluationCount   Int
  recentRating      Float
  
  @@map("contractor_rating_view")
}
```

---

### 9. Settings & Lookups (بازنگری)
```prisma
model Setting {
  id          Int       @id @default(autoincrement())
  key         String    @unique
  value       String
  group       String    @default("general") // general, system, appearance
  type        String    @default("string")  // string, number, boolean, json
  isEditable  Boolean   @default(true)
  description String?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([group])
}

// Keep existing lookup tables with improvements
model Style {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  code        String?   @unique
  description String?
  isActive    Boolean   @default(true)
  
  products    Product[]
  
  createdAt   DateTime  @default(now())
}

model Fabric {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  code        String?   @unique
  description String?
  isActive    Boolean   @default(true)
  
  products    Product[]
  
  createdAt   DateTime  @default(now())
}
```

---

### 10. Audit Logs (بازنگری)
```prisma
model AuditLog {
  id            Int       @id @default(autoincrement())
  
  userId        Int
  user          User      @relation(fields: [userId], references: [id])
  
  action        String    // CREATE, UPDATE, DELETE, LOGIN, EXPORT
  entityType    String    // Order, User, Contractor...
  entityId      Int?
  
  // Changes stored as JSON
  oldValues     Json?
  newValues     Json?
  
  // Request Info
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([entityType])
  @@index([entityId])
  @@index([createdAt])
}
```

---

## 🔧 تغییرات مورد نیاز در بک‌اند

### 1. ساختار Routeهای جدید

```
backend/src/
├── index.js
├── config/
│   ├── database.js
│   ├── auth.js
│   └── constants.js
├── middleware/
│   ├── auth.js
│   ├── validate.js
│   ├── errorHandler.js
│   └── audit.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── roles.js
│   ├── orders/
│   │   ├── index.js
│   │   ├── items.js
│   │   ├── workflow.js
│   │   └── reports.js
│   ├── products/
│   │   ├── index.js
│   │   ├── categories.js
│   │   └── prices.js
│   ├── contractors/
│   │   ├── index.js
│   │   ├── types.js
│   │   └── evaluations.js
│   ├── inventory/
│   │   ├── index.js
│   │   ├── movements.js
│   │   └── warehouses.js
│   ├── materials/
│   │   ├── index.js
│   │   ├── types.js
│   │   └── usage.js
│   ├── sizes/
│   │   ├── categories.js
│   │   └── index.js
│   ├── settings.js
│   └── reports.js
├── services/
│   ├── order.service.js
│   ├── workflow.service.js
│   ├── inventory.service.js
│   ├── report.service.js
│   └── export.service.js
├── utils/
│   ├── prisma.js
│   ├── helpers.js
│   └── validators/
│       ├── order.validator.js
│       ├── product.validator.js
│       └── user.validator.js
└── jobs/
    ├── backup.js
    └── notifications.js
```

### 2. API Endpoints جدید

#### Orders Module
```javascript
// CRUD Orders
GET    /api/orders                    // لیست سفارشات با فیلتر
POST   /api/orders                    // ایجاد سفارش
GET    /api/orders/:id                // جزئیات سفارش
PUT    /api/orders/:id                // ویرایش سفارش
DELETE /api/orders/:id                // حذف سفارش (Admin)

// Order Items
GET    /api/orders/:id/items          // آیتم‌های سفارش
POST   /api/orders/:id/items          // افزودن آیتم
PUT    /api/orders/:id/items/:itemId  // ویرایش آیتم
DELETE /api/orders/:id/items/:itemId  // حذف آیتم

// Order Item Workflow (Workflow per item, not per order)
GET    /api/orders/:id/items/:itemId/workflow       // مراحل گردش کار آیتم
POST   /api/orders/:id/items/:itemId/workflow       // شروع مرحله
PUT    /api/orders/:id/items/:itemId/workflow/:wfId // بروزرسانی مرحله
POST   /api/orders/:id/items/:itemId/workflow/:wfId/transfer  // انتقال به مرحله بعد
POST   /api/orders/:id/items/:itemId/workflow/:wfId/waste     // ثبت ضایعات

// Order Status Management
PUT    /api/orders/:id/status         // تغییر وضعیت سفارش
PUT    /api/orders/:id/priority       // تغییر اولویت

// Payments
GET    /api/orders/:id/payments       // لیست پرداخت‌ها
POST   /api/orders/:id/payments       // ثبت پرداخت جدید
PUT    /api/orders/:id/payments/:paymentId  // ویرایش پرداخت
```

#### Products Module
```javascript
// Products
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id

// Product Sizes
GET    /api/products/:id/sizes
POST   /api/products/:id/sizes
DELETE /api/products/:id/sizes/:sizeId

// Product Categories
GET    /api/products/categories
POST   /api/products/categories

// Product Prices
GET    /api/products/:id/prices
POST   /api/products/:id/prices
```

#### Size Management
```javascript
// Size Categories
GET    /api/sizes/categories
POST   /api/sizes/categories
PUT    /api/sizes/categories/:id
DELETE /api/sizes/categories/:id

// Sizes
GET    /api/sizes?category=:categoryId
POST   /api/sizes
PUT    /api/sizes/:id
DELETE /api/sizes/:id
```

#### Inventory Module (Split into Product and Material)
```javascript
// Product Inventory
GET    /api/inventory/products                    // موجودی محصولات
GET    /api/inventory/products/movements          // گردش انبار محصولات
POST   /api/inventory/products/in                 // ورود محصول به انبار
POST   /api/inventory/products/out                // خروج محصول از انبار
POST   /api/inventory/products/adjust             // تنظیم موجودی محصول

// Material Inventory
GET    /api/inventory/materials                   // موجودی مواد اولیه
GET    /api/inventory/materials/movements         // گردش انبار مواد
POST   /api/inventory/materials/in                // ورود ماده اولیه
POST   /api/inventory/materials/out               // خروج ماده اولیه
POST   /api/inventory/materials/adjust            // تنظیم موجودی ماده

// Stock Views (Computed)
GET    /api/inventory/materials/stock-levels      // سطح موجودی مواد (from view)
GET    /api/inventory/materials/low-stock         // هشدار کمبود موجودی

// Warehouses
GET    /api/inventory/warehouses
POST   /api/inventory/warehouses
PUT    /api/inventory/warehouses/:id
```

#### Contractors Module
```javascript
// Contractors
GET    /api/contractors
POST   /api/contractors
GET    /api/contractors/:id
PUT    /api/contractors/:id
DELETE /api/contractors/:id

// Contractor Evaluations
GET    /api/contractors/:id/evaluations
POST   /api/contractors/:id/evaluations

// Contractor Stats (Computed from evaluations)
GET    /api/contractors/:id/stats        // آمار و ارزیابی‌ها
GET    /api/contractors/ratings          // لیست امتیازات (from view)

// Contractor Types
GET    /api/contractors/types
```

#### Reports Module
```javascript
// Reports
GET    /api/reports/orders               // گزارش سفارشات
GET    /api/reports/production           // گزارش تولید
GET    /api/reports/inventory            // گزارش موجودی
GET    /api/reports/contractors          // گزارش پیمانکاران
GET    /api/reports/financial            // گزارش مالی

// Exports
GET    /api/reports/export/orders        // خروجی Excel
GET    /api/reports/export/production
GET    /api/reports/export/inventory
```

### 3. Services Layer (Business Logic)

#### Order Service
```javascript
// services/order.service.js
class OrderService {
  // Create order with items
  async createOrder(orderData, items) {
    // Validate product availability
    // Calculate totals
    // Create order
    // Create order items with sizes
    // Initialize workflow
    // Log audit
  }
  
  // Update order status
  async updateStatus(orderId, status, notes) {
    // Validate status transition
    // Update status
    // Notify relevant users
    // Log audit
  }
  
  // Get order with full details
  async getOrderDetails(orderId) {
    // Include: items, sizes, workflow, history
  }
  
  // Search orders
  async searchOrders(filters) {
    // Filter by: status, date range, customer, product
  }
}
```

#### Workflow Service
```javascript
// services/workflow.service.js
class WorkflowService {
  // Initialize workflow for order
  async initializeWorkflow(orderId) {
    // Create workflow stages based on product type
  }
  
  // Start stage
  async startStage(workflowId, contractorId, quantity) {
    // Validate quantity
    // Update stage status
    // Log history
  }
  
  // Complete stage
  async completeStage(workflowId, outputQty, wasteQty) {
    // Calculate waste percentage
    // Update stage
    // Transfer to next stage
  }
  
  // Get workflow progress
  async getProgress(orderId) {
    // Calculate percentage complete
    // Return timeline
  }
}
```

#### Inventory Service
```javascript
// services/inventory.service.js
class InventoryService {
  // Stock in
  async stockIn(data) {
    // Update inventory
    // Log movement
    // Update product stock
  }
  
  // Stock out
  async stockOut(data) {
    // Check availability
    // Update inventory
    // Log movement
  }
  
  // Get stock level
  async getStockLevel(productId) {
    // Calculate from movements
  }
  
  // Get low stock alerts
  async getLowStockAlerts() {
    // Return products below min stock
  }
}
```

### 4. Validation Layer

```javascript
// validators/order.validator.js
const Joi = require('joi');

const orderSchema = Joi.object({
  customerName: Joi.string().required().min(2).max(200),
  customerPhone: Joi.string().allow(''),
  deliveryDate: Joi.date().min('now'),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT'),
  description: Joi.string().allow(''),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.number().required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0),
      sizes: Joi.array().items(
        Joi.object({
          sizeCategoryId: Joi.number().required(),
          sizeId: Joi.number().required(),
          quantity: Joi.number().integer().min(0).required()
        })
      )
    })
  ).min(1)
});

module.exports = { orderSchema };
```

---

## 🔄 اسکریپت Migration

### مراحل Migration از ساختار قدیم

```javascript
// migrations/migrate-orders.js
async function migrateOrders() {
  // 1. Create new size categories
  const categories = [
    { name: 'سالم', slug: 'healthy', displayOrder: 1 },
    { name: 'اقتصادی 1', slug: 'economy-1', displayOrder: 2 },
    { name: 'اقتصادی 2', slug: 'economy-2', displayOrder: 3 },
    { name: 'اقتصادی 3', slug: 'economy-3', displayOrder: 4 },
    { name: 'نمونه', slug: 'sample', displayOrder: 5 },
    { name: 'استوک', slug: 'stock', displayOrder: 6 },
  ];
  
  // 2. Create sizes (30-40)
  const sizeNumbers = [30, 31, 32, 33, 34, 36, 38, 40];
  
  // 3. Migrate each old order
  const oldOrders = await prisma.oldOrder.findMany();
  
  for (const oldOrder of oldOrders) {
    // Create new order
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: oldOrder.code,
        customerName: oldOrder.name,
        orderDate: oldOrder.date,
        status: mapStatus(oldOrder.status),
        createdBy: oldOrder.createdBy,
        createdAt: oldOrder.createdAt,
      }
    });
    
    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: newOrder.id,
        productId: await getOrCreateProduct(oldOrder),
        quantity: oldOrder.totalCount || 0,
        status: 'PENDING'
      }
    });
    
    // Migrate sizes
    for (const category of categories) {
      for (const sizeNum of sizeNumbers) {
        const oldField = `size${sizeNum}_${category.slug.replace('-', '')}`;
        const quantity = oldOrder[oldField];
        
        if (quantity && quantity > 0) {
          await prisma.orderItemSize.create({
            data: {
              orderItemId: orderItem.id,
              sizeCategoryId: category.id,
              sizeId: await getSizeId(category.id, sizeNum),
              orderedQty: quantity
            }
          });
        }
      }
    }
    
    // Create initial workflow
    await workflowService.initializeWorkflow(newOrder.id);
  }
}
```

---

## 📱 تغییرات Frontend

### ساختار کامپوننت‌ها

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── DataTable.jsx
│   │   ├── FilterBar.jsx
│   │   ├── StatCard.jsx
│   │   └── StatusBadge.jsx
│   ├── orders/
│   │   ├── OrderForm/
│   │   │   ├── OrderInfo.jsx
│   │   │   ├── OrderItems.jsx
│   │   │   ├── SizeSelector.jsx
│   │   │   └── index.jsx
│   │   ├── OrderWorkflow/
│   │   │   ├── WorkflowTimeline.jsx
│   │   │   ├── StageCard.jsx
│   │   │   └── index.jsx
│   │   └── OrderList/
│   ├── products/
│   ├── inventory/
│   └── contractors/
├── pages/
│   ├── Orders/
│   │   ├── List.jsx
│   │   ├── Create.jsx
│   │   ├── Detail.jsx
│   │   └── Workflow.jsx
│   ├── Products/
│   ├── Inventory/
│   └── Reports/
├── services/
│   ├── api.js
│   ├── order.service.js
│   ├── product.service.js
│   └── inventory.service.js
└── store/
    ├── orderStore.js
    ├── productStore.js
    └── inventoryStore.js
```

---

## 🚀 فازهای اجرایی

### فاز 1: آماده‌سازی (هفته 1)
- [ ] طراحی نهایی و تایید ساختار
- [ ] ایجاد migration scripts
- [ ] Backup دیتابیس فعلی
- [ ] Setup محیط تست

### فاز 2: دیتابیس و مدل‌ها (هفته 1-2)
- [ ] ایجاد جداول جدید در Prisma
- [ ] نوشتن migration scripts
- [ ] تست migration با داده نمونه
- [ ] ایجاد مدل‌های جدید

### فاز 3: API Layer (هفته 2-3)
- [ ] راه‌اندازی ساختار route جدید
- [ ] پیاده‌سازی CRUD اصلی
- [ ] پیاده‌سازی سرویس‌ها
- [ ] تست APIها

### فاز 4: Frontend (هفته 3-4)
- [ ] بازنگری فرم سفارشات
- [ ] صفحه گردش کار
- [ ] مدیریت سایزها
- [ ] داشبورد جدید

### فاز 5: Migration داده (هفته 4)
- [ ] اجرای migration روی داده واقعی
- [ ] اعتبارسنجی داده‌ها
- [ ] رفع خطاهای احتمالی

### فاز 6: تست و دیپلوی (هفته 5)
- [ ] تست کامل سیستم
- [ ] آموزش کاربران
- [ ] دیپلوی نهایی

---

## ⚠️ نکات مهم

### قبل از شروع
1. **حتماً Backup بگیرید** - دیتابیس فعلی کاملاً بکاپ شود
2. **تست محیط** - ابتدا روی دیتای تست اجرا شود
3. **برنامه rollback** - امکان بازگشت به حالت قبل باشد

### ریسک‌ها
1. **طولانی بودن migration** - برای داده زیاد ممکن است زمان‌بر باشد
2. **تغییرات اساسی در UI** - کاربران نیاز به آموزش مجدد دارند
3. **سازگاری با داده قدیمی** - برخی داده‌ها ممکن است نیاز به پاکسازی داشته باشند

### مزایای نهایی
1. ✅ **مقیاس‌پذیری** - امکان اضافه کردن سایز/دسته جدید
2. ✅ **رهگیری کامل** - رهگیری از سفارش تا تحویل
3. ✅ **مدیریت انبار** - سیستم انبارداری کامل
4. ✅ **گزارشات پیشرفته** - امکان گزارش‌گیری از هر بخش
5. ✅ **تعمیر و نگهداری آسان** - کد تمیز و قابل فهم

---

**این ساختار برای رشد بلندمدت طراحی شده و می‌تواند حجم بالای سفارشات و پیچیدگی‌های آینده را مدیریت کند.**
