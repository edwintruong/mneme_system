class MnemeCategory {
  const MnemeCategory({
    required this.id,
    required this.name,
    required this.image,
    required this.itemCount,
  });
  final int id;
  final String name;
  final String image;
  final int itemCount;
}

class SavedLink {
  const SavedLink({
    required this.id,
    required this.title,
    required this.url,
    required this.summary,
    required this.category,
    required this.folder,
    required this.image,
    required this.source,
    this.favorite = false,
  });
  final int id;
  final String title;
  final String url;
  final String summary;
  final String category;
  final String folder;
  final String image;
  final String source;
  final bool favorite;
}

class Notebook {
  const Notebook({
    required this.id,
    required this.title,
    required this.description,
    required this.image,
    required this.itemCount,
  });
  final int id;
  final String title;
  final String description;
  final String image;
  final int itemCount;
}
