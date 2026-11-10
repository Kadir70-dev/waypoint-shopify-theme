# Pexels video sources

Both demo-store videos are from Pexels under the Pexels License (https://www.pexels.com/license/): free for commercial use, attribution not required. They are store content (Shopify Files), not bundled with the theme.

Recovered on 2026-11-08 from the sourcing session of 2026-11-07, where each Pexels video page was fetched and its title, creator and specs were read from the page. Fields marked **missing** were not recorded in that session and have not been filled in.

| Store file | Used in | Pexels page | ID | Title | Creator | Original (per page) | Download URL | Store file specs |
|---|---|---|---|---|---|---|---|---|
| waypoint-hiker-france-1080.mp4 | Home page — Video page breaker | [link](https://www.pexels.com/video/hiker-ascends-misty-mountain-in-france-32562962/) | 32562962 | Hiker Ascends Misty Mountain in France | [Florian Delée](https://www.pexels.com/@florian-delee-209542985/) | 3840x2160, 0:05, 59.94 fps | https://www.pexels.com/download/video/32562962/ | H.264, 1920x1080, 5.8 s, 3.6 MB |
| waypoint-patagonia-1080.mp4 | Product page — Video page breaker | [link](https://www.pexels.com/video/trekking-in-patagonia-s-misty-mountains-30240552/) | 30240552 | Trekking in Patagonia's Misty Mountains | [Florian Delée](https://www.pexels.com/@florian-delee-209542985/) | 3840x2160, 0:09 | **missing** | H.264, 1920x1080, 9.8 s, 3.4 MB |

Missing records: Patagonia download URL; frame rate of the Patagonia original; the transcode settings used to make the 1080p store files. SHA-256 of the downloaded originals and the 1080p files are in `CHECKSUMS.sha256` (`videos/`).

## Bundled with the theme

`assets/breakervideo.mp4` (the Video page breaker fallback when no video is selected) is the same file as `waypoint-hiker-france-1080.mp4` above — Pexels video 32562962 by Florian Delée, Pexels License (SHA-256 in `CHECKSUMS.sha256`, `videos/waypoint-hiker-france-1080.mp4`). It replaced an earlier bundled video whose source was not recorded.

The bundled hero fallbacks `assets/hero-slide-{1,2,3}.jpg` and `-mobile.jpg` are the Pexels files `hero-1/2/3(.jpg|-mobile.jpg)` listed in `SOURCES.md` (same SHA-256 as `CHECKSUMS.sha256`, `images/`).
