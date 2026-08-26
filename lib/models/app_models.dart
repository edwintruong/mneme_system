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
    this.tags = const [],
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
  final List<String> tags;
  final bool favorite;
}

class NotebookSection {
  const NotebookSection({required this.title, required this.body});

  final String title;
  final String body;

  Map<String, dynamic> toJson() => {'title': title, 'body': body};

  factory NotebookSection.fromJson(Map<String, dynamic> json) =>
      NotebookSection(
        title: json['title'] as String? ?? '',
        body: json['body'] as String? ?? '',
      );
}

class Notebook {
  const Notebook({
    required this.id,
    required this.title,
    required this.description,
    required this.image,
    required this.itemCount,
    this.sections = const [],
  });
  final int id;
  final String title;
  final String description;
  final String image;
  final int itemCount;
  final List<NotebookSection> sections;
}
