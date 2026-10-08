export interface FlutterFile {
  filename: string;
  category: string;
  language: string;
  code: string;
  description: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    filename: 'pubspec.yaml',
    category: 'Configuration',
    language: 'yaml',
    description: 'Flutter dependencies including Firebase, Geolocator, Google Maps, and Provider',
    code: `name: locallens
description: "LocalLens - AI-Powered Nearby Street Shop Finder within 0.5km"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  # State Management
  provider: ^6.1.1
  # Firebase Core & Services
  firebase_core: ^2.27.0
  firebase_auth: ^4.17.8
  cloud_firestore: ^4.15.8
  # Location & GPS
  geolocator: ^11.0.0
  google_maps_flutter: ^2.5.3
  # Utilities & Quick Actions
  url_launcher: ^6.2.4
  http: ^1.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/markers/
`,
  },
  {
    filename: 'lib/main.dart',
    category: 'Entry Point',
    language: 'dart',
    description: 'Application entry point initializing Firebase and MultiProvider',
    code: `import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'providers/shop_provider.dart';
import 'providers/auth_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/permission/location_permission_screen.dart';
import 'screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const LocalLensApp());
}

class LocalLensApp extends StatelessWidget {
  const LocalLensApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ShopProvider()),
      ],
      child: MaterialApp(
        title: 'LocalLens',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFF59E0B), // Warm street amber
            brightness: Brightness.light,
          ),
          fontFamily: 'Roboto',
        ),
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.value(value: context.watch<AuthProvider>());
    if (authProvider.currentUser == null) {
      return const LoginScreen();
    }
    return const LocationPermissionScreen();
  }
}
`,
  },
  {
    filename: 'lib/models/shop.dart',
    category: 'Data Models',
    language: 'dart',
    description: 'Shop model representing street stalls with 500m geofencing attributes',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';

class Shop {
  final String id;
  final String name;
  final String category;
  final String stallType;
  final String ownerName;
  final String landmark;
  final double latitude;
  final double longitude;
  final String phone;
  final String operatingHours;
  final bool isOpen;
  final double rating;
  final int reviewCount;
  final String priceRange;
  final bool upiAccepted;
  final List<String> specialties;
  final String imageUrl;
  final String vendorStory;
  final double distanceMeters; // Calculated dynamically from user coordinates

  Shop({
    required this.id,
    required this.name,
    required this.category,
    required this.stallType,
    required this.ownerName,
    required this.landmark,
    required this.latitude,
    required this.longitude,
    required this.phone,
    required this.operatingHours,
    required this.isOpen,
    required this.rating,
    required this.reviewCount,
    required this.priceRange,
    required this.upiAccepted,
    required this.specialties,
    required this.imageUrl,
    required this.vendorStory,
    this.distanceMeters = 0.0,
  });

  factory Shop.fromFirestore(DocumentSnapshot doc, double distance) {
    final data = doc.data() as Map<String, dynamic>;
    final geoPoint = data['location'] as GeoPoint;
    return Shop(
      id: doc.id,
      name: data['name'] ?? '',
      category: data['category'] ?? 'General',
      stallType: data['stallType'] ?? 'Street Stall',
      ownerName: data['ownerName'] ?? 'Local Vendor',
      landmark: data['landmark'] ?? '',
      latitude: geoPoint.latitude,
      longitude: geoPoint.longitude,
      phone: data['phone'] ?? '',
      operatingHours: data['operatingHours'] ?? 'All Day',
      isOpen: data['isOpen'] ?? true,
      rating: (data['rating'] as num?)?.toDouble() ?? 4.5,
      reviewCount: data['reviewCount'] ?? 10,
      priceRange: data['priceRange'] ?? '₹',
      upiAccepted: data['upiAccepted'] ?? true,
      specialties: List<String>.from(data['specialties'] ?? []),
      imageUrl: data['imageUrl'] ?? '',
      vendorStory: data['vendorStory'] ?? '',
      distanceMeters: distance,
    );
  }

  Shop copyWithDistance(double distance) {
    return Shop(
      id: id,
      name: name,
      category: category,
      stallType: stallType,
      ownerName: ownerName,
      landmark: landmark,
      latitude: latitude,
      longitude: longitude,
      phone: phone,
      operatingHours: operatingHours,
      isOpen: isOpen,
      rating: rating,
      reviewCount: reviewCount,
      priceRange: priceRange,
      upiAccepted: upiAccepted,
      specialties: specialties,
      imageUrl: imageUrl,
      vendorStory: vendorStory,
      distanceMeters: distance,
    );
  }
}
`,
  },
  {
    filename: 'lib/services/location_service.dart',
    category: 'Services',
    language: 'dart',
    description: 'Geolocator wrapper to request permissions and compute Haversine distance',
    code: `import 'package:geolocator/geolocator.dart';

class LocationService {
  /// Request GPS permission and return current device position
  static Future<Position> determinePosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('GPS Location services are disabled. Please enable GPS.');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied. Please grant via Settings.');
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  /// Exact distance in meters using geodesic formula
  static double getDistanceBetween(
    double startLat,
    double startLng,
    double endLat,
    double endLng,
  ) {
    return Geolocator.distanceBetween(startLat, startLng, endLat, endLng);
  }
}
`,
  },
  {
    filename: 'lib/providers/shop_provider.dart',
    category: 'State Management',
    language: 'dart',
    description: 'ShopProvider queries Firestore within strict 0.5km and handles AI filtering',
    code: `import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:geolocator/geolocator.dart';
import '../models/shop.dart';
import '../services/location_service.dart';

class ShopProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Position? _currentPosition;
  List<Shop> _allNearbyShops = [];
  List<Shop> _filteredShops = [];
  bool _isLoading = false;
  String _selectedCategory = 'All';
  double _radiusLimitMeters = 500.0; // Strict 0.5km

  Position? get currentPosition => _currentPosition;
  List<Shop> get shops => _filteredShops;
  bool get isLoading => _isLoading;
  String get selectedCategory => _selectedCategory;
  double get radiusLimitMeters => _radiusLimitMeters;

  Future<void> fetchNearbyShops(Position userPos) async {
    _currentPosition = userPos;
    _isLoading = true;
    notifyListeners();

    try {
      // Hyperlocal bounding box (1 deg ≈ 111km -> 0.005 deg ≈ 550m)
      const double latDelta = 0.005;
      const double lonDelta = 0.005;

      final snapshot = await _firestore
          .collection('shops')
          .where('location', isGreaterThan: GeoPoint(userPos.latitude - latDelta, userPos.longitude - lonDelta))
          .where('location', isLessThan: GeoPoint(userPos.latitude + latDelta, userPos.longitude + lonDelta))
          .get();

      List<Shop> loaded = [];
      for (var doc in snapshot.docs) {
        final data = doc.data();
        final geo = data['location'] as GeoPoint;
        final distance = LocationService.getDistanceBetween(
          userPos.latitude,
          userPos.longitude,
          geo.latitude,
          geo.longitude,
        );

        // Strict 500m radius filter
        if (distance <= _radiusLimitMeters) {
          loaded.add(Shop.fromFirestore(doc, distance));
        }
      }

      // Sort by proximity: closest street vendor first
      loaded.sort((a, b) => a.distanceMeters.compareTo(b.distanceMeters));
      _allNearbyShops = loaded;
      _applyCategoryFilter();
    } catch (e) {
      if (kDebugMode) print('Error fetching shops: \$e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setCategory(String category) {
    _selectedCategory = category;
    _applyCategoryFilter();
  }

  void _applyCategoryFilter() {
    if (_selectedCategory == 'All') {
      _filteredShops = List.from(_allNearbyShops);
    } else {
      _filteredShops = _allNearbyShops
          .where((s) => s.category.toLowerCase() == _selectedCategory.toLowerCase())
          .toList();
    }
    notifyListeners();
  }
}
`,
  },
  {
    filename: 'lib/screens/home/home_screen.dart',
    category: 'UI Screens',
    language: 'dart',
    description: 'Home Screen featuring Google Map, 500m geofence circle, and draggable bottom list',
    code: `import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../../providers/shop_provider.dart';
import '../../models/shop.dart';
import '../details/shop_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  GoogleMapController? _mapController;
  final Set<Marker> _markers = {};
  final Set<Circle> _circles = {};

  @override
  Widget build(BuildContext context) {
    final shopProvider = context.watch<ShopProvider>();
    final pos = shopProvider.currentPosition;

    if (pos == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final userLatLng = LatLng(pos.latitude, pos.longitude);

    // Build 500m radius geofence circle
    _circles.clear();
    _circles.add(
      Circle(
        circleId: const CircleId('radar_0_5km'),
        center: userLatLng,
        radius: 500.0,
        fillColor: Colors.amber.withOpacity(0.12),
        strokeColor: Colors.amber,
        strokeWidth: 2,
      ),
    );

    // Build custom markers for nearby street shops
    _markers.clear();
    for (var shop in shopProvider.shops) {
      _markers.add(
        Marker(
          markerId: MarkerId(shop.id),
          position: LatLng(shop.latitude, shop.longitude),
          infoWindow: InfoWindow(
            title: shop.name,
            snippet: '\${shop.distanceMeters.round()}m away • \${shop.category}',
            onTap: () => _openShopDetail(shop),
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('LocalLens (0.5km Radius)'),
        backgroundColor: Colors.amber.shade700,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: () {
              _mapController?.animateCamera(
                CameraUpdate.newLatLngZoom(userLatLng, 16.5),
              );
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: CameraPosition(target: userLatLng, zoom: 16.5),
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            circles: _circles,
            markers: _markers,
            onMapCreated: (ctrl) => _mapController = ctrl,
          ),
          _buildDraggableSheet(shopProvider),
        ],
      ),
    );
  }

  Widget _buildDraggableSheet(ShopProvider provider) {
    return DraggableScrollableSheet(
      initialChildSize: 0.35,
      minChildSize: 0.15,
      maxChildSize: 0.85,
      builder: (context, scrollCtrl) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, spreadRadius: 2)],
          ),
          child: ListView(
            controller: scrollCtrl,
            padding: const EdgeInsets.all(16),
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Nearby Street Stalls (\${provider.shops.length} within 500m)',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 12),
              ...provider.shops.map((shop) => _buildShopTile(shop)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildShopTile(Shop shop) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 1,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.amber.shade100,
          child: const Icon(Icons.storefront, color: Colors.amber),
        ),
        title: Text(shop.name, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text('\${shop.distanceMeters.round()}m away • \${shop.category}'),
        trailing: Chip(
          label: Text(shop.isOpen ? 'OPEN' : 'CLOSED', style: const TextStyle(fontSize: 10, color: Colors.white)),
          backgroundColor: shop.isOpen ? Colors.green : Colors.grey,
        ),
        onTap: () => _openShopDetail(shop),
      ),
    );
  }

  void _openShopDetail(Shop shop) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => ShopDetailScreen(shop: shop)));
  }
}
`,
  },
  {
    filename: 'lib/screens/details/shop_detail_screen.dart',
    category: 'UI Screens',
    language: 'dart',
    description: 'Shop Detail Screen with quick actions (Call, WhatsApp, Navigation)',
    code: `import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/shop.dart';

class ShopDetailScreen extends StatelessWidget {
  final Shop shop;
  const ShopDetailScreen({super.key, required this.shop});

  Future<void> _makePhoneCall(String phone) async {
    final uri = Uri.parse('tel:\$phone');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  Future<void> _openGoogleNavigation(double lat, double lng) async {
    final uri = Uri.parse('google.navigation:q=\$lat,\$lng&mode=w'); // 'w' for walking mode
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      final webUri = Uri.parse('https://www.google.com/maps/dir/?api=1&destination=\$lat,\$lng&travelmode=walking');
      await launchUrl(webUri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(shop.name),
        backgroundColor: Colors.amber.shade700,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(shop.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text('\${shop.landmark} • \${shop.distanceMeters.round()} meters away',
                style: TextStyle(color: Colors.grey.shade700)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                    icon: const Icon(Icons.call),
                    label: const Text('Call'),
                    onPressed: () => _makePhoneCall(shop.phone),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.amber.shade800, foregroundColor: Colors.white),
                    icon: const Icon(Icons.directions_walk),
                    label: const Text('Walk (Navigate)'),
                    onPressed: () => _openGoogleNavigation(shop.latitude, shop.longitude),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Specialties & Offerings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: shop.specialties.map((s) => Chip(label: Text(s))).toList(),
            ),
            const SizedBox(height: 20),
            const Text('Vendor Story & Heritage', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text(shop.vendorStory, style: const TextStyle(fontSize: 14, height: 1.4)),
          ],
        ),
      ),
    );
  }
}
`,
  },
];
