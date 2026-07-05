import { Vendor, Product, PriceHistory, AdminSetting } from './db.ts';

export const CATEGORIES = [
  'Electronics & Gadgets',
  'Fashion',
  'Home & Living',
  'Beauty & Personal Care',
  'Armories & Accessories',
  'Sports & Outdoors',
  'Baby & Kids',
  'Automotive'
];

export const SEED_VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Shenzhen Micro Systems',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '8613800138000',
    country: 'China',
    rating: 4.8,
    bio: 'Your primary direct source for top grade consumer electronics, custom audio drivers, and IoT equipment.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-2',
    name: 'Naji Wear & Fashion',
    logo_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '2348123456789',
    country: 'Nigeria',
    rating: 4.9,
    bio: 'Premium crafted African native fabrics, bespoke formal attire, and custom-tailored street garments.',
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-3',
    name: 'London Heritage Outfitters',
    logo_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '447123456789',
    country: 'UK',
    rating: 4.7,
    bio: 'Bespoke European trench coats, leather bags, and executive footwear crafted with heritage methodologies.',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-4',
    name: 'Glow-Up Skincare Labs',
    logo_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '12025550143',
    country: 'USA',
    rating: 4.6,
    bio: 'Organic facial serums, squalane cosmetics, and pure essential extracts formulated for premium wellness.',
    created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-5',
    name: 'Al-Habtoor Premium Exports',
    logo_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '971501234567',
    country: 'UAE',
    rating: 4.9,
    bio: 'Luxury Arabic Oud oils, custom-gilded timepieces, and hand-embroidered silken sand slippers.',
    created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-6',
    name: 'Eko Tactical & Protection',
    logo_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '2348039999999',
    country: 'Nigeria',
    rating: 4.9,
    bio: 'Bespoke security vests, protective gears, multi-functional luggage, and durable heavy-duty footwear.',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-7',
    name: 'California Athletic Labs',
    logo_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '13105550198',
    country: 'USA',
    rating: 4.8,
    bio: 'High-performance activewear, smart metrics accessories, and recovery compression equipment.',
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-8',
    name: 'Desert Sun Co-Op',
    logo_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '971551234568',
    country: 'UAE',
    rating: 4.5,
    bio: 'Bespoke handwoven wool tapestries, brass espresso boilers, and authentic Middle Eastern accents.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-9',
    name: 'Shenzhen Optics & Drone',
    logo_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '8613900139000',
    country: 'China',
    rating: 4.7,
    bio: 'Aerodynamic gimbal drones, smart phone lenses, and high-fidelity pocket video projection matrices.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-10',
    name: 'Lagos Fine Leather Works',
    logo_url: 'https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '2348199998888',
    country: 'Nigeria',
    rating: 4.7,
    bio: 'Executive leather portfolios, travel bags, and custom hand-stitched administrative boots.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-11',
    name: 'Coventry Automotive Depot',
    logo_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '447911122233',
    country: 'UK',
    rating: 4.6,
    bio: 'Professional-grade ceramic sealants, high-index carbon fiber dashboard panels, and specialized tools.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vendor-12',
    name: 'KidCare Safe Labs',
    logo_url: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=150&auto=format&fit=crop&q=60',
    whatsapp_number: '12125550187',
    country: 'USA',
    rating: 4.8,
    bio: 'Ergonomically sound toddler support structures, organic baby play grids, and protective accessories.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Definition of 64 Products spread across 8 categories, 8 products per category.
export const SEED_PRODUCTS_RAW = [
  // 1. Electronics & Gadgets
  {
    name: 'AeroMax Noise-Cancelling Headphones',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-1',
    price_usd: 155,
    discount_percent: 15,
    description: 'Experience auditory bliss with premium active noise cancellation. Features ultra-soft memory foam earcups, custom acoustic drivers, and 40-hour continuous playback with hyper GaN charge support.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'ANC Rating': 'Up to 38dB', 'Battery Life': '40 Hours', 'Connectivity': 'Bluetooth 5.3', 'Audio': 'Hi-Res Certified' }
  },
  {
    name: 'Quantum X-Pro Smartwatch',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-1',
    price_usd: 110,
    discount_percent: 10,
    description: 'High-precision wearable designed to monitor biometric signals (heart-rate, blood oxygen, stress index) paired with custom multi-channel GPS logging and high-contrast AMOLED face.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Display': '1.43" AMOLED', 'Water Resistance': '5ATM', 'Sensors': 'Optical HR, GPS, SpO2', 'Shell': 'Aviation Aluminum' }
  },
  {
    name: 'SmartVibe 4K Soundbar',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-1',
    price_usd: 130,
    discount_percent: 5,
    description: 'Dolby Atmos home sound system featuring eight built-in transducers, deep-channel wireless bass subwoofers, and intelligent voice assistant synchronization.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Channels': '5.1 virtual Atmos', 'Power': '220W Peak', 'Inputs': 'HDMI eARC, Optical, AUX', 'Width': '90cm' }
  },
  {
    name: 'Shenzhen Hawk Eye 4K Drone',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-9',
    price_usd: 299,
    discount_percent: 20,
    description: 'Professional-grade light quadcopter featuring real-time 3-axis mechanical gimbal stabilizing, smart point-to-point pathing, and robust wind resistance.',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Resolution': '4K Cinema 30FPS', 'Flight Time': '31 Mins', 'Control Distance': '8KM', 'Weight': '249g' }
  },
  {
    name: 'Lumina Pro 4K Pocket Projector',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-9',
    price_usd: 180,
    discount_percent: 12,
    description: 'Palm-sized display engine utilizing modern DLP matrix technology. Projects sharp 120-inch displays on any surface, equipped with integrated speakers and custom casting protocols.',
    images: [
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1461151304267-385357477330?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Luminance': '600 ANSI Lumens', 'Native Resolution': '1080P Full HD', 'Projection Size': '30"-120"', 'OS': 'Android TV' }
  },
  {
    name: 'Titan GaN 140W Charger Block',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-1',
    price_usd: 45,
    discount_percent: 8,
    description: 'State-of-the-art Gallium Nitride (GaN) power brick featuring three USB-C ports and one USB-A port. Capable of charging laptops, phones, and tablets at maximal hardware velocity.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Output': '140W Max', 'Technology': 'GaN Safe V5', 'Ports': '3x USB-C / 1x USB-A', 'Protocol': 'PD 3.1 / QC 4.0' }
  },
  {
    name: 'SoundPod Pure ANC Earbuds',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-1',
    price_usd: 75,
    discount_percent: 15,
    description: 'High-fidelity audio monitors engineered with direct-to-drum acoustics. Blocks 95% of background humming and optimizes streaming protocols for perfect syncing.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'ANC Rating': 'Up to 32dB', 'Battery': '8h + 24h Case', 'Drivers': '10mm Neodymium', 'Protection': 'IPX4 sweat proof' }
  },
  {
    name: 'Helios Portable Solar Station',
    category: 'Electronics & Gadgets',
    vendor_id: 'vendor-9',
    price_usd: 220,
    discount_percent: 10,
    description: 'Rugged outdoor accumulator utilizing premium monocrystalline conversion surfaces. Charges accessories under direct sunlight, fitted with flashlights and micro USB arrays.',
    images: [
      'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Capacity': '50000mAh', 'Solar Input': '20W Max', 'Ports': 'Dual USB-A, Type-C', 'Casing': 'Drop-proof TPU' }
  },

  // 2. Fashion
  {
    name: 'Urban Vanguard Leather Jacket',
    category: 'Fashion',
    vendor_id: 'vendor-2',
    price_usd: 200,
    discount_percent: 18,
    description: 'Timeless outerwear silhouette hand-sewn using 100% full-grain calf leather. Lined with premium satin-mesh fabric, fitted with asymmetric steel zippers and structural interior compartments.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5b504?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1481973964104-ee166e729a41?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': 'Calf Leather', 'Lining': 'Satin Flow', 'Hardware': 'YKK Zippers', 'Origin': 'Lagos, Nigeria' }
  },
  {
    name: 'SwiftRun Knit Trainer Sneakers',
    category: 'Fashion',
    vendor_id: 'vendor-7',
    price_usd: 60,
    discount_percent: 5,
    description: 'Engineered with elastic-mesh breathable uppers and ultra-responsive spring soles. Provides perfect structural foot support, ideal for distance cardio workouts or active lifestyle wear.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Upper': 'Elastic Knit Mesh', 'Sole': 'Rebound TPU', 'Weight': '210g per shoe', 'Aesthetic': 'Cyan Accent Details' }
  },
  {
    name: 'Tuscany Italian Suede Loafers',
    category: 'Fashion',
    vendor_id: 'vendor-3',
    price_usd: 70,
    discount_percent: 10,
    description: 'Slip-on luxury loafers designed with buttery-soft Italian suede leather. Finished with custom hand-stitched aprons and flexible anti-skid rubber blocks.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Outer': 'Calf Suede', 'Insole': 'Memory Foam', 'Outsole': 'Injection Rubber Blocks', 'Origin': 'Florence, Italy' }
  },
  {
    name: 'Executive Silk Necktie Set',
    category: 'Fashion',
    vendor_id: 'vendor-2',
    price_usd: 35,
    discount_percent: 0,
    description: 'A cohesive administrative bundle containing a pure mulberry silk tie, matching pocket square, and polished steel cufflinks, nestled in a modular storage case.',
    images: [
      'https://images.unsplash.com/photo-1589756823851-ede1bf1dd67c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Fabric': '100% Mulberry Silk', 'Tie Width': '8cm Classic', 'Cufflinks': 'Heavy Plated Brass', 'Included': 'Tie, Square, Links' }
  },
  {
    name: 'London Classic Trench Coat',
    category: 'Fashion',
    vendor_id: 'vendor-3',
    price_usd: 175,
    discount_percent: 12,
    description: 'Double-breasted heritage silhouette designed with premium weatherproof cotton gabardine. Features signature horn buttons, dual storm flaps, and customizable belt closures.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': 'Cotton Gabardine', 'Finish': 'Water Repellent', 'Length': 'Mid-Calf Classic', 'Button Type': 'Oxhorn Replacements' }
  },
  {
    name: 'Prestige GMT Automatic Watch',
    category: 'Fashion',
    vendor_id: 'vendor-5',
    price_usd: 150,
    discount_percent: 10,
    description: 'A classic GMT traveler timepiece with a self-winding mechanical movement. Features a bi-directional rotatable bezel, calendar lens, and surgical steel oyster link band.',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Movement': 'Japanese Miyota Automatic', 'Glass': 'Sapphire Crystal', 'Case Size': '41mm', 'Depth Limit': '100m' }
  },
  {
    name: 'Sahara Gold Accent Sandals',
    category: 'Fashion',
    vendor_id: 'vendor-5',
    price_usd: 40,
    discount_percent: 5,
    description: 'Handcrafted leather sandals inspired by desert nomads, customized with subtle gold-finished brass loops and padded arch supporting layers.',
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Leather': 'Vegetable Tanned Cowhide', 'Accents': 'Gold-gilded Brass', 'Sole': 'High Density EVA', 'Origin': 'Dubai, UAE' }
  },
  {
    name: 'Nomad Canvas Travel Duffle',
    category: 'Fashion',
    vendor_id: 'vendor-10',
    price_usd: 80,
    discount_percent: 15,
    description: 'Heavy duty, water-resistant military cotton duck canvas combined with thick full-grain leather straps. The perfect carry-on size for international co-op traveling.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Volume': '45L', 'Canvas': '18oz Waxed Cotton', 'Trims': 'Bridle Leather', 'Sizing': '55 x 28 x 28 cm' }
  },

  // 3. Home & Living
  {
    name: 'Nero-Barista Espresso Machine',
    category: 'Home & Living',
    vendor_id: 'vendor-3',
    price_usd: 280,
    discount_percent: 12,
    description: 'Bespoke micro-boiler designed to execute cafe-level espresso extractions at home. Equipped with 15-bar Italian pumps and dedicated hot-vapor milk structuring tubes.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Pump Power': '15-Bar Italian', 'Reservoir': '1.8L Removable', 'Heater': 'ThermoBlock rapid coil', 'Housing': 'Satin Steel' }
  },
  {
    name: 'Ergonomic Space-Mesh Desk Chair',
    category: 'Home & Living',
    vendor_id: 'vendor-3',
    price_usd: 110,
    discount_percent: 8,
    description: 'Premium back support system utilizing high-elastic mesh cells. Highly customizable 3D armrests, integrated lumbar spring nodes, and full 135-degree gas-lift recline capabilities.',
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Mesh': 'Korean Elastic Fiber', 'Base': 'Chrome Steel Hub', 'Gas Class': 'SGS Class 4 Cylinder', 'Load Capacity': '150KG' }
  },
  {
    name: 'Minimalist Oak Dining Pendant',
    category: 'Home & Living',
    vendor_id: 'vendor-3',
    price_usd: 90,
    discount_percent: 5,
    description: 'Scandinavian-style overhead dining lighting meticulously turned from solid oak blocks, housing high-index LED strips casting warm, comforting ambient glows.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Lumber': '100% Solid White Oak', 'Light Specs': '24W Warm LED 2700K', 'Drop Length': '150cm Adjustable', 'Power Support': '110-240V' }
  },
  {
    name: 'Premium Silken Persian Rug',
    category: 'Home & Living',
    vendor_id: 'vendor-8',
    price_usd: 320,
    discount_percent: 15,
    description: 'Intricately woven traditional floor tapestry utilizing silk-blend fibers. Standard wash-safe layout boasting vintage medallions and high-density soft threads.',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576016770956-debb63d900ef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Weave': '600,000 Nodes per SQM', 'Thread Blend': '60% Silk / 40% New Zealand Wool', 'Thickness': '8mm Dense Pile', 'Dimensions': '240 x 170 cm' }
  },
  {
    name: 'Handcrafted Copper Kettle',
    category: 'Home & Living',
    vendor_id: 'vendor-8',
    price_usd: 55,
    discount_percent: 0,
    description: 'A genuine copper water vessel hand-beaten by Dubai artisans. Boasts perfect heating conductivity, brass handles, and a goose-neck pouring spout for absolute barista control.',
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Base Metal': '99% Pure Hand-beaten Copper', 'Handle': 'Cast Brass', 'Capacity': '1.2L', 'Spout': 'Precision Gooseneck' }
  },
  {
    name: 'Aura Air Purifier Pro',
    category: 'Home & Living',
    vendor_id: 'vendor-12',
    price_usd: 130,
    discount_percent: 10,
    description: 'A medical-grade air particulate absorber containing custom active carbon filters and true H13 HEPA matrices. Eliminates pollen, smoke, and pet dander quietly.',
    images: [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522204538344-922f76ecc041?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Filter Type': 'True HEPA H13 & Carbon', 'CADR Speed': '250 m³/h', 'Noise Limit': '22dB Sleeping mode', 'Floor Range': 'Up to 40 SQM' }
  },
  {
    name: 'Smart Sleep Bamboo Sheet Set',
    category: 'Home & Living',
    vendor_id: 'vendor-8',
    price_usd: 65,
    discount_percent: 5,
    description: 'Luxuriously soft sheet bundle woven from organic bamboo viscose. Highly thermo-regulating and moisture-wicking, providing cool touch experiences through warm nights.',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Fiber': '100% Organic Bamboo Viscose', 'Thread Count': '400 (equivalent to 1000 cotton)', 'Pocket Fit': 'Up to 40cm deep mattresses', 'Set Includes': '1 Fitted, 1 Flat, 2 Pillows' }
  },
  {
    name: 'Zen-Line Walnut Floating Shelves',
    category: 'Home & Living',
    vendor_id: 'vendor-3',
    price_usd: 75,
    discount_percent: 10,
    description: 'Pair of sleek, heavy-duty shelves cut from genuine American Walnut. Concealed steel hanging plates provide seamless floating styling, adding executive tone to walls.',
    images: [
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Timber': 'Prime American Black Walnut', 'Bracket': 'Hidden Solid Steel Brackets', 'Load Limit': '18KG per shelf', 'Dimensions': '60 x 15 x 4 cm' }
  },

  // 4. Beauty & Personal Care
  {
    name: 'Hydra-Dew Squalane Moisturizer',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-4',
    price_usd: 22,
    discount_percent: 10,
    description: 'Banish dry lines with pure sugarcane-extracted squalane combined with protective lipid-ceramides and triple hyaluronic hydration vectors. Light, hypoallergenic, and scentless.',
    images: [
      'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Squalane Source': '100% Sugar Cane Extract', 'Skin Types': 'Dry, Sensitive, Combination', 'Additive Exclusions': 'Sulfate, Paraben, Fragrance', 'Net Weight': '75ml e' }
  },
  {
    name: 'Aetheria Oud Luxury Perfume',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-5',
    price_usd: 88,
    discount_percent: 15,
    description: 'An alluring oriental fragrance that lingers on memory. Opens with warm saffron and sweet citrus, centering Cambodian premium oud and damask rose on an amber base.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Concentration': 'Eau de Parfum (22%)', 'Longevity': 'Heavy 12+ Hours sillage', 'Base Notes': 'Oud, Amber, Saffron, Rose', 'Bottle Capacity': '100ml / 3.4oz' }
  },
  {
    name: 'Botanic Renewal Facial Oil',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-4',
    price_usd: 32,
    discount_percent: 5,
    description: 'Organic seed press containing cold-pressed rosehip seed oil, vitamin E, and golden jojoba liquid. Restores lipid gloss and helps fade post-inflammatory hyperpigmentations.',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Oils Blend': 'Rosehip, Jojoba, Marula', 'Organic Rank': 'USDA Certified Organic', 'Volume': '30ml / 1 fl. oz', 'Aura': 'Subtle Neroli' }
  },
  {
    name: 'Professional Ionic Hair Dryer',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-1',
    price_usd: 120,
    discount_percent: 20,
    description: 'Heavy duty high-velocity hair dryer powered by a brushless 110,000 RPM motor. Releases 200 million negative ions to eliminate static frizz while drying rapidly.',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584006682522-dc17d6c0d9cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Motor Speed': '110,000 RPM Brushless', 'Airflow Volume': '15 m/s Max', 'Heat Steps': '3 Speed, 4 Temperature', 'Power Rating': '1600W' }
  },
  {
    name: 'Jade Roller & Gua Sha Set',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-4',
    price_usd: 20,
    discount_percent: 0,
    description: 'Facial massage tools carved from 100% natural grade-A Xiuyan jade. Relieves muscular tension in jawlines, stimulates lymphatic drainage, and de-puffs skin under eyes.',
    images: [
      'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Mineral': '100% Authentic Xiuyan Jade', 'Roller Frame': 'No-Squeak Zinc Alloy Gold', 'Gua Sha Cut': 'Heart Shape ergonomic', 'Kit Contains': '1x Roller, 1x Gua Sha, Storage pouch' }
  },
  {
    name: 'Charcoal Detox Cleansing Gel',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-4',
    price_usd: 18,
    discount_percent: 5,
    description: 'Purifying wash gel loaded with suspended activated bamboo charcoal and soothing tea tree oil. Deeply unplugs congestion in oily pore channels, balancing excess sebum.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Active Agent': 'Activated Bamboo Charcoal', 'Acne Vector': 'Tea Tree Extract 1%', 'pH Score': '5.5 Balanced', 'Net Capacity': '150ml' }
  },
  {
    name: 'Velvet Matte Lip Elixir Trio',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-4',
    price_usd: 45,
    discount_percent: 10,
    description: 'A luxurious set of three highly-pigmented matte liquid lipsticks. Features a non-drying, weightless formula enriched with hydrating rosehip seed oil.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Finish': 'Velvet Matte 16H', 'Hydrators': 'Rosehip Oil & Shea Butter', 'Shades Included': 'Nude, Classic Red, Berry Rose', 'Formulation': 'Vegan & Cruelty Free' }
  },
  {
    name: 'Sea Salt & Sandalwood Scrub',
    category: 'Beauty & Personal Care',
    vendor_id: 'vendor-4',
    price_usd: 24,
    discount_percent: 0,
    description: 'Exfoliating body scrub utilizing mineral-rich sea salt crystals suspended in a nourishing sweet almond oil and sandalwood essential oil base.',
    images: [
      'https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Exfoliator': 'Dead Sea Salt Crystals', 'Nutrient Base': 'Sweet Almond & Jojoba Oils', 'Net Weight': '250g e / 8.8 oz', 'Aura Profile': 'Sandalwood & Warm Vanilla' }
  },

  // 5. Armories & Accessories
  {
    name: 'Vanguard Kevlar Tactical Vest',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 150,
    discount_percent: 10,
    description: 'Professional grade protective gear, constructed utilizing heavy duty 1000D ballistic nylon and reinforced internal slots to accommodate security steel sheets.',
    images: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Fabric': '1000D Ballistic Cordura', 'System': 'MOLLE Attachment webbing', 'Weight': '1.8KG empty', 'Slots': 'Dual (Chest & Back)' }
  },
  {
    name: 'Steel-Core Heavy Duty Belt',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 45,
    discount_percent: 5,
    description: 'An unyielding load support belt boasting an internal spring steel stiffener wrapped in double layers of military-grade nylon webbing and a quick-release Cobra buckle.',
    images: [
      'https://images.unsplash.com/photo-1624222247566-7f8240269acb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Stiffener': 'Spring Steel Core', 'Webbing': 'High-Tensile Military Nylon', 'Buckle': 'Dual-Trigger Alloy Cobra', 'Belt Width': '1.75 inches' }
  },
  {
    name: 'Falcon EDC Titanium Pocket Knife',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 60,
    discount_percent: 8,
    description: 'Precision everyday carry folding knife. Boasts a wear-resistant D2 steel drop point blade nestled in a lightweight, sandblasted titanium skeleton frame with frame lock.',
    images: [
      'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Blade Material': 'D2 Tool Steel (60 HRC)', 'Handle': 'TC4 Titanium Alloy', 'Lock': 'Titanium Frame Lock', 'Weight': '82g' }
  },
  {
    name: 'Lumens Ultra Tactical Flashlight',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 30,
    discount_percent: 15,
    description: 'A powerful defense illumination beam throwing 5000 lumens up to 300 meters. Features a strike-ready crenellated aluminum bezel and custom strobe vectors.',
    images: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Power Output': '5000 ANSI Lumens', 'Throw Distance': '300m Peak', 'Protection': 'IP68 waterproof / 2m drop', 'Accumulator': '21700 Li-ion 5000mAh' }
  },
  {
    name: 'Defender Plus Pepper Spray Pen',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 15,
    discount_percent: 0,
    description: 'A discreet personal security spray disguised as an executive writing pen. Fires a high-intensity stream of 1.33% Major Capsaicinoids up to 3 meters.',
    images: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Agent': '10% Oleoresin Capsicum (OC)', 'Strength': '1.33% Major Capsaicinoids', 'Range': '3 Meters Stream', 'Bursts': '15 quick sprays' }
  },
  {
    name: 'Eko Hard-Shell Security Suitcase',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 110,
    discount_percent: 10,
    description: 'Ultra-durable, crush-proof security luggage made from reinforced polycarbonate. Features custom biometrically accessed heavy locks and GPS tracking.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Shell Material': 'Covestro Polycarbonate 3-Layer', 'Lock Type': 'Biometric & TSA Keypad Combo', 'Wheels': '360° Whisper-glide dual spinners', 'Volume': '38L Cabin Size' }
  },
  {
    name: 'Guardian Faraday Signal Pouch',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 25,
    discount_percent: 5,
    description: 'A pocket-sized administrative shield utilizing dual layers of metal-mesh fiber to block all RF signals, securing car key fobs and credit cards from electronic thieves.',
    images: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Shield Grade': 'MIL-SPEC 810G shielding', 'Blocking Range': '10MHz to 40GHz (99.99%)', 'Capacity': 'Accommodates up to 6.7" phones', 'Exterior': 'Ballistic Shield Oxford cloth' }
  },
  {
    name: 'Aegis Carbon Fiber Slim Wallet',
    category: 'Armories & Accessories',
    vendor_id: 'vendor-6',
    price_usd: 35,
    discount_percent: 0,
    description: 'Sleek, minimalist cash and credit card carrier constructed utilizing genuine carbon fiber sheets and strong elastic. Includes RFID block protection.',
    images: [
      'https://images.unsplash.com/photo-1624222247566-7f8240269acb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Face sheets': '3K Matte Carbon Fiber', 'Capacity': '1 to 12 cards + cash clip', 'Defense': 'Integrated RFID shield', 'Weight': '54g' }
  },

  // 6. Sports & Outdoors
  {
    name: 'Peak Athlete Smart Jump Rope',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 28,
    discount_percent: 10,
    description: 'High-speed fitness rope featuring magnetic hall sensors in handles to log skipping revolutions. Automatically syncs with active metric logs over Bluetooth.',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Tracking': 'Revolution count, calories, duration', 'Link': 'Bluetooth 5.0 App sync', 'Cable': '3m PVC coated steel cord', 'Power': 'USB-C Rechargeable' }
  },
  {
    name: 'AeroStream Carbon Tennis Racket',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 140,
    discount_percent: 15,
    description: 'Designed for maximal power-to-ratio metrics. Features a high modulus carbon fiber unibody frame, optimized sweet spot, and vibration absorbent grips.',
    images: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a4b1dc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Composition': '100% High-Modulus Carbon Fiber', 'Weight': '295g unstrung', 'Head Sizing': '100 sq inches', 'Balance': '320mm' }
  },
  {
    name: 'Summit Explorer Hydration Pack',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 50,
    discount_percent: 5,
    description: 'Outdoor trail run pack fitted with an integrated 2L food-grade TPU water bladder. Features breathable mesh backing and multiple zipper compartments for EDC gears.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470246958604-14387f17275f?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Liquid Bladder': '2.0L Leakproof TPU', 'Backpack Space': '12L Gear space', 'Fabric': 'Ripstop water resistant nylon', 'Harness': 'Adjustable chest & waist bounds' }
  },
  {
    name: 'Neo-Grip Non-Slip Yoga Mat',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 35,
    discount_percent: 0,
    description: 'High-density, eco-friendly TPE foam mat. Features dual-textured surfaces to prevent hand slips, customized with laser-etched posture alignment guidelines.',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': 'Eco-TPE (Biodegradable)', 'Thickness': '6mm shock absorbtion', 'Sizing': '183 x 61 cm', 'Guides': 'Laser-engraved Alignment lines' }
  },
  {
    name: 'Dynamo Kinetic Bike Computer',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-1',
    price_usd: 45,
    discount_percent: 10,
    description: 'Wireless cycling tracker featuring accurate GPS speedometers, real-time cadence meters, and high-contrast water-resistant LCD sheets.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Sensors': 'High-precision GNSS GPS, Altimeter', 'Battery Life': '25 hours active tracking', 'Water Guard': 'IPX7 certified', 'Connectivity': 'ANT+ / Bluetooth 5.0' }
  },
  {
    name: 'TrailBlazer Compact Camp Stove',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 38,
    discount_percent: 12,
    description: 'An ultra-compact, high-efficiency camping burner machined from titanium-aluminum alloy. Includes custom Piezo electric ignition.',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470246958604-14387f17275f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': '70% Titanium, 30% Stainless Steel', 'Output Capacity': '3200W (Boils 1L in 3.5m)', 'Fuel type': 'Isobutane canisters', 'Folded size': '5.5 x 8 cm' }
  },
  {
    name: 'HydroPulse Stainless 1.2L Bottle',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 25,
    discount_percent: 0,
    description: 'Double-wall vacuum insulated container made from food-grade 18/8 stainless steel. Keeps liquids cold for 24 hours or hot for 12 hours.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592318787723-53302f4e8c74?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Insulation': 'Double Wall Vacuum Shield', 'Steel Grade': '18/8 Food-grade Pro', 'Fluid Cap': '1.2 Liters / 40 oz', 'Caps Included': 'Straw cap & Flex cap' }
  },
  {
    name: 'AeroTrek Folding Trekking Poles',
    category: 'Sports & Outdoors',
    vendor_id: 'vendor-7',
    price_usd: 40,
    discount_percent: 10,
    description: 'Adjustable folding hiking sticks made of high-grade carbon-aluminum. Features anti-shock lock springs and sweat-absorbent EVA cork grips.',
    images: [
      'https://images.unsplash.com/photo-1470246958604-14387f17275f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Stick Shaft': 'Carbon Fiber Upper, 7075 Alum lower', 'Lock System': 'Quick-Flip secure clamping', 'Length Scope': '110cm to 135cm', 'Weight': '210g per pole' }
  },

  // 7. Baby & Kids
  {
    name: 'KidCare Ergonomic Baby Carrier',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 85,
    discount_percent: 15,
    description: 'A pediatric-approved ergonomic baby carrier providing dual lumbar safety nodes and fully modular front and back carrying orientations.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Safe Bounds': '3.2KG to 20KG load', 'Carrying Layouts': 'Front-in, Front-out, Back, Hip', 'Belt Range': '66cm to 140cm', 'Material': 'Breathable 3D mesh fabric' }
  },
  {
    name: 'EcoWood Sensory Block Stacker',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 25,
    discount_percent: 0,
    description: 'Classic toy handcrafted using organic beechwood blocks coated with safe vegetable-dyed pigments. Boosts spatial hand-eye coordination.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Wood Base': 'Sustainably sourced Beechwood', 'Pigment': '100% Water-based organic dyes', 'Recommended age': '12 Months to 4 Years', 'Blocks Count': '18 unique sensory blocks' }
  },
  {
    name: 'PureComfort Organic Swaddle',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 30,
    discount_percent: 5,
    description: 'Ultra-soft, organic bamboo muslin swaddling wraps. Highly breathable and elastic, ensuring warm, comforting womb-like snugness.',
    images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Fiber': '70% Organic Bamboo / 30% Cotton', 'Dimensions': '120 x 120 cm', 'Elasticity': 'Natural muslin stretch', 'Set Volume': '3 premium wraps' }
  },
  {
    name: 'Starlight Nebula Nursery Projector',
    category: 'Baby & Kids',
    vendor_id: 'vendor-1',
    price_usd: 40,
    discount_percent: 10,
    description: 'Ambient LED projector casting beautiful rotating star constellations and soft nebulae, outfitted with soothing white noise players and auto timers.',
    images: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Light System': 'Soft eye-safe LED', 'Audio tracks': '8 integrated lullabies / noises', 'Timer': '30, 60, 120 Mins options', 'Power Source': 'USB rechargeable' }
  },
  {
    name: 'TinyBites Silicone Bibs Set',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 15,
    discount_percent: 0,
    description: 'Set of three waterproof bibs made of food-grade soft silicone. Features deep front crumb-catcher pockets and adjustable neck buttons.',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': '100% FDA Approved Silicone', 'Clean Mode': 'Dishwasher safe', 'Recommended age': '4 Months to 3 Years', 'Quantity': '3 items per bundle' }
  },
  {
    name: 'SmartSafe Infrared Thermometer',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 35,
    discount_percent: 10,
    description: 'Medical-grade non-contact forehead thermometer. Delivers highly accurate temperature readings in 1 second with a soft color-coded fever alarm.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Accuracy Range': '±0.2°C (±0.4°F)', 'Read speed': '1.0 Second', 'Distance limit': '1cm - 5cm', 'Memory Log': '32 readings recall' }
  },
  {
    name: 'HappySprout Baby Play Mat',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 50,
    discount_percent: 8,
    description: 'A large, padded, foldable crawling play space made of certified non-toxic XPE foam, customized with colorful sensory illustrations.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': 'BPA-free Non-Toxic XPE foam', 'Thickness': '1.5cm shock cushion', 'Sizing': '200 x 180 cm', 'Foldable': 'Dual accordion-fold layout' }
  },
  {
    name: 'TinyTread Orthopedic Shoes',
    category: 'Baby & Kids',
    vendor_id: 'vendor-12',
    price_usd: 28,
    discount_percent: 0,
    description: 'Pediatrician-certified toddler shoes made of breathable natural organic cotton with flexible, non-slip orthopedic rubber soles.',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Upper Fabric': '100% Organic Breathable Cotton', 'Outsole': 'Orthopedic Zero-Slip Rubber', 'Fastener': 'Hook-and-loop adjustable strap', 'Weight': '45g per shoe' }
  },

  // 8. Automotive
  {
    name: 'Coventry Ceramic Detailing Kit',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 48,
    discount_percent: 10,
    description: 'Professional grade SiO2 ceramic hybrid liquid wax. Shields vehicle paint against aggressive UV sun rays and acid-rain stains with hyper water-shedding action.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'SiO2 Content': '12% Active Nanoparticles', 'Protection Frame': 'Up to 12 Months glossy shield', 'Volume': '500ml liquid', 'Kit Extras': '2x Microfiber towel, applicator block' }
  },
  {
    name: 'DriveSync 4K Dual Dash Camera',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 95,
    discount_percent: 15,
    description: 'High-index camera set recording front and rear traffic vectors in native 4K. Features automatic shock-recording sensors and night-vision capabilities.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Resolution': 'Front 4K Cinema / Rear 1080P', 'Image Sensor': 'Sony Starvis Night-Vision', 'G-Sensor': '3-Axis impact auto-lock', 'Link': 'Built-in 5G WiFi App sync' }
  },
  {
    name: 'MotoCharge 12V Jump Starter',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 65,
    discount_percent: 10,
    description: 'High-current portable lithium accumulator, capable of starting dead 12V batteries (up to 8.0L gas or 6.0L diesel engines) safely.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Peak Current': '2000A start current', 'Capacity': '16000mAh Powerbank', 'Gas Range': 'Up to 8.0L Gas / 6.0L Diesel', 'Protections': 'Reverse polarity, spark proof' }
  },
  {
    name: 'Carbon Car License Frame',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 24,
    discount_percent: 0,
    description: 'Sleek license plate border machined from authentic 3K twill carbon fiber. Adds a high-end racing aesthetic to any administrative plate layout.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': '100% Real 3K Carbon Fiber', 'Pattern': 'Twill weave Glossy', 'Fit': 'Standard US / NGN plates', 'Screws': 'Included matching security caps' }
  },
  {
    name: 'ErgoComfort Memory Foam Cushion',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 35,
    discount_percent: 5,
    description: 'Premium memory foam seat support wedge. Ergonomically contoured to relieve tailbone pressure and prevent stiffness during long commuter trips.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Filling': '100% High-Density Memory Foam', 'Cover': 'Breathable sports mesh, removable', 'Bottom': 'Zero-slip silicone dots backing', 'Design': 'Coccyx U-shape relief' }
  },
  {
    name: 'StormShield Outdoor Car Cover',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 80,
    discount_percent: 10,
    description: 'Heavy-duty 6-layer vehicle wrap designed to protect against rain, snow, tree sap, and harsh scratching. Fitted with wind buckles and reflective stripes.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Layers Count': '6 Heavy-Duty levels', 'Inner liner': 'Satin-soft anti-scratch cotton', 'Wind Guards': '4 strap ties + center buckle', 'Size Fit': 'Universal sedan fit' }
  },
  {
    name: 'PureBreeze Ionic Car Air Ionizer',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 20,
    discount_percent: 0,
    description: 'Compact 12V cigarette lighter air purifier releasing 5.6 million negative ions to eliminate cigarette smoke, pet odors, and microscopic molds.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Negative Ion Density': '5.6 Million pcs/cm³', 'Power Input': '12V Lighter Socket', 'USB Ports': 'Dual 2.1A charging ports', 'Ozone Rating': 'Safe ≤0.05ppm' }
  },
  {
    name: 'TurboGrip Leather Wheel Wrap',
    category: 'Automotive',
    vendor_id: 'vendor-11',
    price_usd: 25,
    discount_percent: 5,
    description: 'Bespoke steering wheel cover made of high-quality microfiber leather with breathable sports mesh grips. Hand-stitch feel without sewing.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80'
    ],
    specs: { 'Material': 'Microfiber Leather & Mesh grip', 'Diameter Scope': '37cm to 38.5cm Standard', 'Scent Profile': 'Odourless food-grade interior ring', 'Structure': 'Padded sweat-absorbent grip' }
  }
];

// Helper to convert the raw array into official database seed entities
export const getSeededProducts = (): Product[] => {
  return SEED_PRODUCTS_RAW.map((p, idx) => ({
    id: `prod-seed-${idx + 1}`,
    vendor_id: p.vendor_id,
    name: p.name,
    description: p.description,
    price_usd: p.price_usd,
    price_ngn: Math.round(p.price_usd * 1600), // Standard NGN translation
    discount_percent: p.discount_percent,
    category: p.category,
    images: p.images,
    specs: p.specs,
    stock_status: 'in_stock' as const,
    created_at: new Date(Date.now() - (30 - Math.floor(idx / 2)) * 24 * 60 * 60 * 1000).toISOString()
  }));
};

export const getSeededPriceHistory = (productsList: Product[]): PriceHistory[] => {
  const history: PriceHistory[] = [];
  productsList.forEach(p => {
    // Generate 5-6 points over the last 30 days
    for (let i = 5; i >= 0; i--) {
      const daysAgo = i * 5;
      const fluctuation = 1 + (Math.sin(daysAgo + parseInt(p.id.replace(/\D/g, '') || '1')) * 0.06);
      const historicPrice = Math.round(p.price_ngn * fluctuation);
      history.push({
        id: `ph-seed-${p.id}-${i}`,
        product_id: p.id,
        price_ngn: historicPrice,
        recorded_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  });
  return history;
};

export const SEED_ADMIN_SETTINGS: AdminSetting = {
  id: 1,
  admin_email: 'musajohnjonathan@gmail.com',
  referral_code: 'MUSA2024',
  discount_percentage: 10,
  whatsapp_link: 'https://wa.me/2348039999999',
  app_name: 'Social Shopperfy',
  hero_title: 'Social Shopperfy: Global Sourcing Made Simple',
  hero_subtitle: 'Connect directly with certified international factories. Unlock group buy discounts, engage our intelligent AI negotiation agent, and complete secure checkouts in Naira or US Dollars.',
  shipping_rate_kg: 2200
};
