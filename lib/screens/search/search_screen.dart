import 'package:flutter/material.dart';

import '../../state/store_scope.dart';
import '../../widgets/common.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  String query = '';
  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final results = store.links
        .where(
          (l) => '${l.title} ${l.folder} ${l.category}'.toLowerCase().contains(
            query.toLowerCase(),
          ),
        )
        .toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Tìm kiếm')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            autofocus: true,
            onChanged: (v) => setState(() => query = v),
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Tìm link, folder hoặc category...',
            ),
          ),
          const SizedBox(height: 18),
          ...results.map((link) => LinkTile(link: link)),
        ],
      ),
    );
  }
}
