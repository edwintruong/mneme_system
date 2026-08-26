import 'package:path/path.dart' as p;
import 'package:sqflite/sqflite.dart';

class LocalDatabase {
  LocalDatabase._(this.db);
  final Database db;

  static Future<LocalDatabase> open() async {
    final path = p.join(await getDatabasesPath(), 'mneme_demo.db');
    final db = await openDatabase(
      path,
      version: 2,
      onCreate: (db, _) async {
        await db.execute(
          'CREATE TABLE categories(id INTEGER PRIMARY KEY, name TEXT NOT NULL, image TEXT NOT NULL, item_count INTEGER NOT NULL)',
        );
        await db.execute(
          'CREATE TABLE folders(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL)',
        );
        await db.execute(
          'CREATE TABLE links(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, url TEXT NOT NULL, summary TEXT NOT NULL, category TEXT NOT NULL, folder TEXT NOT NULL, image TEXT NOT NULL, source TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT 0)',
        );
        await db.execute(
          'CREATE TABLE notebooks(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, item_count INTEGER NOT NULL DEFAULT 0)',
        );
        await _seed(db);
      },
      onUpgrade: (db, oldVersion, _) async {
        if (oldVersion < 2) {
          await _seedRecipe(db);
        }
      },
    );
    return LocalDatabase._(db);
  }

  static Future<void> _seed(Database db) async {
    const categories = [
      [1, 'Figma Tips & Tricks', 'assets/images/figma.png', 24],
      [2, 'Travel Inspiration', 'assets/images/travel.png', 10],
      [3, 'Movies to Watch', 'assets/images/movies.png', 10],
      [4, 'Cake Receipts', 'assets/images/cake.png', 10],
    ];
    for (final row in categories) {
      await db.insert('categories', {
        'id': row[0],
        'name': row[1],
        'image': row[2],
        'item_count': row[3],
      });
    }
    for (final name in ['UI/UX', 'Graphic', 'Motion', '3D']) {
      await db.insert('folders', {'name': name, 'category': 'Design'});
    }
    for (var i = 0; i < 4; i++) {
      await db.insert('links', {
        'title': i == 0
            ? 'Figma Auto Layout Tips'
            : 'How to build a design system',
        'url': 'https://www.youtube.com/watch?v=mneme-demo-$i',
        'summary': 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
        'category': 'Design',
        'folder': i.isEven ? 'UI/UX' : 'Graphic',
        'image': i == 0
            ? 'assets/images/recent.png'
            : 'assets/images/figma.png',
        'source': i.isEven ? 'YouTube' : 'TikTok',
        'favorite': i == 0 ? 1 : 0,
      });
    }
    await db.insert('notebooks', {
      'title': 'Figma Tips & Tricks',
      'description': 'Gorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'image': 'assets/images/figma.png',
      'item_count': 24,
    });
    await db.insert('notebooks', {
      'title': 'Travel Inspiration',
      'description': 'Những địa điểm và trải nghiệm đáng lưu lại.',
      'image': 'assets/images/travel.png',
      'item_count': 10,
    });
    await db.insert('notebooks', {
      'title': 'Movies to Watch',
      'description': 'Danh sách phim tuyển chọn.',
      'image': 'assets/images/movies.png',
      'item_count': 10,
    });
    await _seedRecipe(db);
  }

  static Future<void> _seedRecipe(Database db) async {
    await db.insert('links', {
      'title': 'Bánh chuối bằng nồi chiên không dầu',
      'url': 'https://www.tiktok.com/@mneme/video/air-fryer-banana-cake',
      'summary': 'Công thức làm bánh chuối mềm thơm bằng nồi chiên không dầu, nhanh và dễ làm tại nhà.',
      'category': 'Ẩm thực',
      'folder': 'Công thức',
      'image': 'assets/images/cake.png',
      'source': 'TikTok',
      'favorite': 0,
    });
  }
}
