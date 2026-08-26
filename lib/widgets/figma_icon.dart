import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Exact vector exports from the Mneme Figma file.
///
/// Keep the SVG bytes untouched. These files are committed because Figma MCP
/// download URLs expire and because using Material glyphs changes the design.
abstract final class FigmaAssets {
  static const _root = 'assets/icons/figma';
  static const _root2159 = 'assets/icons/figma_2159';

  static const plus = '$_root2159/2159_12771_plus.svg';
  static const search = '$_root2159/2159_12771_search.svg';
  static const filter = '$_root2159/2159_12771_filter.svg';
  static const moreVertical = '$_root/home_more_vertical.svg';
  static const homeMoreVertical = '$_root2159/2159_12771_more_vertical.svg';
  static const moreHorizontal = '$_root/add_link_more.svg';
  static const back = '$_root/add_link_back.svg';
  static const link = '$_root/add_link_link.svg';
  static const close = '$_root/add_link_icon_1.svg';
  static const dropdown = '$_root/add_link_dropdown_close.svg';
  static const chevronRight = '$_root/category_icon_3.svg';
  static const plusSmall = '$_root/category_icon_5.svg';

  static const navBackground = '$_root2159/2159_12771_nav_bg.svg';
  static const homeActive = '$_root2159/2159_12771_nav_home.svg';
  static const homeIdle = '$_root/notebook_nav_home.svg';
  static const notebookActive = '$_root/notebook_nav_notebook.svg';
  static const notebookIdle = '$_root2159/2159_12771_nav_notebook.svg';
  static const activityIdle = '$_root2159/2159_12771_nav_activity.svg';
  static const profileIdle = '$_root2159/2159_12771_nav_profile.svg';

  static const addCircle = '$_root/notebook_add_circle.svg';
  static const star = '$_root/link_detail_star.svg';
  static const share = '$_root/link_detail_share.svg';
  static const copy = '$_root/link_detail_copy.svg';
  static const layers = '$_root/link_detail_layers.svg';
  static const youtube = '$_root/link_detail_youtube.svg';
  static const plusCircle = '$_root/link_detail_icon_3.svg';
  static const clock = '$_root/link_detail_icon_4.svg';
  static const openBook = '$_root/notebook_detail_open_book.svg';
  static const ai = '$_root/notebook_detail_ai.svg';
  static const edit = '$_root/notebook_detail_edit.svg';
  static const directionDown = '$_root/notebook_detail_direction_down.svg';
  static const radio = '$_root/select_sources_radio.svg';
  static const radioSelected = '$_root/select_sources_radio_1.svg';
  static const analysisCheckmark = '$_root/notebook_analysis_icon_0.svg';
  static const analysisProgress = '$_root/notebook_analysis_group_1.svg';
  static const analysisPending = '$_root/select_sources_radio_1.svg';
  static const folderBack = '$_root/folder_detail_back.svg';
  static const folderMore = '$_root/folder_detail_more_horizontal.svg';
  static const moveFolder = '$_root/move_folder.svg';
  static const delete = '$_root/delete.svg';
  static const tag = '$_root/tag.svg';
}

class FigmaIcon extends StatelessWidget {
  const FigmaIcon(
    this.asset, {
    super.key,
    this.size = 24,
    this.color,
    this.semanticLabel,
  });

  final String asset;
  final double size;
  final Color? color;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: size,
    child: SvgPicture.asset(
      asset,
      width: size,
      height: size,
      fit: BoxFit.contain,
      colorFilter: color == null
          ? null
          : ColorFilter.mode(color!, BlendMode.srcIn),
      semanticsLabel: semanticLabel,
    ),
  );
}

class FigmaVector extends StatelessWidget {
  const FigmaVector(
    this.asset, {
    super.key,
    required this.width,
    required this.height,
    this.fit = BoxFit.contain,
  });

  final String asset;
  final double width;
  final double height;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: width,
    height: height,
    child: SvgPicture.asset(asset, width: width, height: height, fit: fit),
  );
}

class FigmaAnalysisStatus extends StatelessWidget {
  const FigmaAnalysisStatus({
    super.key,
    required this.done,
    required this.inProgress,
    this.size = 20,
  });

  final bool done;
  final bool inProgress;
  final double size;

  @override
  Widget build(BuildContext context) {
    if (done) {
      return Container(
        width: size,
        height: size,
        padding: EdgeInsets.all(size * .2),
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0xFF31CF37),
        ),
        child: FigmaIcon(FigmaAssets.analysisCheckmark, size: size * .6),
      );
    }
    return FigmaIcon(
      inProgress ? FigmaAssets.analysisProgress : FigmaAssets.analysisPending,
      size: size,
    );
  }
}

class FigmaBackButton extends StatelessWidget {
  const FigmaBackButton({super.key, this.color});

  final Color? color;

  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: MaterialLocalizations.of(context).backButtonTooltip,
    onPressed: () => Navigator.maybePop(context),
    icon: FigmaIcon(FigmaAssets.back, size: 30, color: color),
  );
}
