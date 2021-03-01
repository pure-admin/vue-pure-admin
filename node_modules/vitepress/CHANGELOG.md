## [0.7.4](https://github.com/vuejs/vitepress/compare/v0.7.3...v0.7.4) (2020-11-11)

### Bug Fixes

- **css:** fix padding on mobile ([9c7293b](https://github.com/vuejs/vitepress/commit/9c7293b6cbdbcabb4257793e1b1f3fea2388c31e)), closes [#121](https://github.com/vuejs/vitepress/issues/121)

## [0.7.3](https://github.com/vuejs/vitepress/compare/v0.7.2...v0.7.3) (2020-11-06)

### Bug Fixes

- Fix sidebar page switch layout shifting
- Fix production hydration mismatch

## [0.7.2](https://github.com/vuejs/vitepress/compare/v0.7.1...v0.7.2) (2020-11-02)

### Bug Fixes

- adapt to vite fix of ssr build asset paths ([6b3fbe3](https://github.com/vuejs/vitepress/commit/6b3fbe31a31adad2a836c45905bde86332e4f1f6))

### Features

- add home page feature ([#108](https://github.com/vuejs/vitepress/issues/108)) ([3a0af0b](https://github.com/vuejs/vitepress/commit/3a0af0b6141ed739aa4a2d72f43d0fa63739c695))

## [0.7.1](https://github.com/vuejs/vitepress/compare/v0.7.0...v0.7.1) (2020-10-30)

### Bug Fixes

- compat with latest vite + handle no export default script tags in md ([b10da2f](https://github.com/vuejs/vitepress/commit/b10da2f47b456a10e62f16e2cd08d6983da041c0))
- fix switch language error ([#103](https://github.com/vuejs/vitepress/issues/103), [#106](https://github.com/vuejs/vitepress/issues/106)) ([#104](https://github.com/vuejs/vitepress/issues/104)) ([d354d1e](https://github.com/vuejs/vitepress/commit/d354d1ef2211cc8734a7228d56f27b014af7a4f9))

# [0.7.0](https://github.com/vuejs/vitepress/compare/v0.6.0...v0.7.0) (2020-10-19)

### Bug Fixes

- **css:** theme specific ([6891092](https://github.com/vuejs/vitepress/commit/6891092b90d5a405a718b08b30c7be5260adef47))
- **router:** remove fakeHost when fixing url extenions ([2eb3135](https://github.com/vuejs/vitepress/commit/2eb31358bf4790a08f43c102691df75023382ce5))

### Features

- **client:** add slot for a searchbar ([68d9b18](https://github.com/vuejs/vitepress/commit/68d9b18f391b9ad1dd8d800296a6117119e397b5))
- **i18n:** add nav dropdown language selector feature ([#91](https://github.com/vuejs/vitepress/issues/91)) ([294836c](https://github.com/vuejs/vitepress/commit/294836ce40afcb9e3af8146575d06bf386bfe1a1))
- **sidebar:** close when navigating ([2094d53](https://github.com/vuejs/vitepress/commit/2094d534dbe9f84d308fbf130dabbf6155a33005))
- add doctype html ([02f2e10](https://github.com/vuejs/vitepress/commit/02f2e10f89881d99bf3c016477da788c25ef207f))
- add some space between 2 code blocks ([5daa8d2](https://github.com/vuejs/vitepress/commit/5daa8d2c38d3c8352b340ad1f5fd4a67d1fdb09b))

# [0.6.0](https://github.com/vuejs/vitepress/compare/v0.5.0...v0.6.0) (2020-09-17)

### Bug Fixes

- **client:** use relative import ([725a04c](https://github.com/vuejs/vitepress/commit/725a04cdf02f208c85de01e4f1e74168511b95aa))
- **links:** keep relative hash links as is ([a90d971](https://github.com/vuejs/vitepress/commit/a90d971b40d775e2bac19bcfd17cbeafbc878d34))
- **router:** allow open new tab with ctrl + click ([#69](https://github.com/vuejs/vitepress/issues/69)) ([092ee77](https://github.com/vuejs/vitepress/commit/092ee772dafa78a66c2e35524bd921eb0aa31b16))
- **sidebar:** no margin on mobile ([#89](https://github.com/vuejs/vitepress/issues/89)) ([218c729](https://github.com/vuejs/vitepress/commit/218c72915489e25e1d6ca7b09979c45abf64a3a3))
- sidebar not working correctly when path starts with slash ([610cc17](https://github.com/vuejs/vitepress/commit/610cc17af0624d82d0eb3ed652f0b5fa1c2402f0))
- **sidebar:** fix sidebar when you open a nested link ([#73](https://github.com/vuejs/vitepress/issues/73)) ([d2b6d39](https://github.com/vuejs/vitepress/commit/d2b6d39228a03ad122ab09420dab2cba2c2b4167))

### Features

- add blockquote styling ([8c1aada](https://github.com/vuejs/vitepress/commit/8c1aada6288609c2f01c14f353359a14d1264244))
- add charset and viewport meta tags ([#77](https://github.com/vuejs/vitepress/issues/77)) ([2e8e1f5](https://github.com/vuejs/vitepress/commit/2e8e1f57cc7618c4cbc198153dde3927b076b08c))
- add git repo link and edit links ([#55](https://github.com/vuejs/vitepress/issues/55)) ([0ea34cb](https://github.com/vuejs/vitepress/commit/0ea34cbb1de0db8a2ff34bb858c2904c89369ccd))
- add prev/next links ([#56](https://github.com/vuejs/vitepress/issues/56)) ([f52b1d5](https://github.com/vuejs/vitepress/commit/f52b1d576b024443f737604d2220a0edb1571355))
- add responsive sidebar support ([#75](https://github.com/vuejs/vitepress/issues/75)) ([39dbd78](https://github.com/vuejs/vitepress/commit/39dbd7806e96e18e60de87311ae7b162ebb61c3c))
- add table css from vuepress ([#88](https://github.com/vuejs/vitepress/issues/88)) ([8435e36](https://github.com/vuejs/vitepress/commit/8435e36374e2d5c96bbab781f378602e2372f5d4))
- close the sidebar when clicking outside of the sidebar ([#78](https://github.com/vuejs/vitepress/issues/78)) ([e93ee09](https://github.com/vuejs/vitepress/commit/e93ee094ea5696d692323546738d0643ed82f154))
- navlinks in sidebar ([#80](https://github.com/vuejs/vitepress/issues/80)) ([a20bcf3](https://github.com/vuejs/vitepress/commit/a20bcf3cd7c4d8e243d6547f099b9fdc702ee350))
- overwrite prev/next link ([#61](https://github.com/vuejs/vitepress/issues/61)) ([1b96f63](https://github.com/vuejs/vitepress/commit/1b96f631b83585591a1436b8a7dadf52fad61c25))
- support config alias ([#59](https://github.com/vuejs/vitepress/issues/59)) ([63a3691](https://github.com/vuejs/vitepress/commit/63a36919601df678a0f8225627d66dff67c81c3a))
- top and bottom slots for sidebar and page ([#90](https://github.com/vuejs/vitepress/issues/90)) ([1106013](https://github.com/vuejs/vitepress/commit/11060136c4bf2ec1d39e0d0d6951b9093e3edc06))
- **sidebar:** use base when creating link ([#74](https://github.com/vuejs/vitepress/issues/74)) ([79bc9fb](https://github.com/vuejs/vitepress/commit/79bc9fb15a9560932228f22e7bd152272d577da6))

# [0.5.0](https://github.com/vuejs/vitepress/compare/v0.4.1...v0.5.0) (2020-07-21)

### Bug Fixes

- decode hash before selecting ([e782c4c](https://github.com/vuejs/vitepress/commit/e782c4cb86dbb8ff294d0670e171692651618a0e))
- fix navbar withBase ([e9ab56b](https://github.com/vuejs/vitepress/commit/e9ab56b0dbe859c0a147e2a2755bfcf2c0b92904))
- typings field in package.json ([#48](https://github.com/vuejs/vitepress/issues/48)) ([692a490](https://github.com/vuejs/vitepress/commit/692a490986ab81eb5be5bc7fdce0434ce84aa620))

### Features

- add external link support for nav items ([#46](https://github.com/vuejs/vitepress/issues/46)) ([44e91bb](https://github.com/vuejs/vitepress/commit/44e91bb98631c843f9accad1cffd24fbc6337fe0))
- add multi sidebar support ([#38](https://github.com/vuejs/vitepress/issues/38)) ([#49](https://github.com/vuejs/vitepress/issues/49)) ([050fa4c](https://github.com/vuejs/vitepress/commit/050fa4cf245f9f33d25684f8bcf218a6b5d6dedb))
- i18n support ([#50](https://github.com/vuejs/vitepress/issues/50)) ([7802cb5](https://github.com/vuejs/vitepress/commit/7802cb55c2a82cc1878fc1ebc4dc2fcf1f2f1ff0))
- nav dropdown ([#51](https://github.com/vuejs/vitepress/issues/51)) ([5780461](https://github.com/vuejs/vitepress/commit/578046145ff4ef445f7a7704016ab791a4ef330f))

## [0.4.1](https://github.com/vuejs/vitepress/compare/v0.4.0...v0.4.1) (2020-07-02)

### Bug Fixes

- avoid error when requesting non-existing md file ([e77ea63](https://github.com/vuejs/vitepress/commit/e77ea6323720f19d7401cb1a9fa94d1963f29e15))
- resolve relative path on windows ([#27](https://github.com/vuejs/vitepress/issues/27)) ([9116c9c](https://github.com/vuejs/vitepress/commit/9116c9c3e06071f34b523cb488d9e5d963808a3c))
- use resolve instead of join ([#33](https://github.com/vuejs/vitepress/issues/33)) ([6f10ed6](https://github.com/vuejs/vitepress/commit/6f10ed6c63b7486f678fdd7eedc888925feb473c))

### Features

- add array sidebar support ([#35](https://github.com/vuejs/vitepress/issues/35)) ([4a8388e](https://github.com/vuejs/vitepress/commit/4a8388e113f978f6afc6936a86b06effc42a8304))

# [0.4.0](https://github.com/vuejs/vitepress/compare/v0.3.1...v0.4.0) (2020-06-19)

## [0.3.1](https://github.com/vuejs/vitepress/compare/v0.3.0...v0.3.1) (2020-06-05)

### Bug Fixes

- avoid using **DEV** + throttle active header link ([a63b0cf](https://github.com/vuejs/vitepress/commit/a63b0cf69a4d1f8b1b7e44f76c6283f28d437b59))

# [0.3.0](https://github.com/vuejs/vitepress/compare/v0.2.0...v0.3.0) (2020-06-02)

### Bug Fixes

- lazy load @vue/server-render for production build ([382e1b6](https://github.com/vuejs/vitepress/commit/382e1b6514035f69dc9e505fad38a781cd35166e))

### Features

- active sidebar links ([d2ea963](https://github.com/vuejs/vitepress/commit/d2ea9637eeafc1c1510d038f1f749e650a086a32))

# [0.2.0](https://github.com/vuejs/vitepress/compare/v0.1.1...v0.2.0) (2020-05-22)

### Bug Fixes

- avoid unnecessary prefetches ([0a81525](https://github.com/vuejs/vitepress/commit/0a815255b9f226ec5ac032d6db5b151caa9c58fb))
- handle links that embed other elements ([#2](https://github.com/vuejs/vitepress/issues/2)) ([4cbfc60](https://github.com/vuejs/vitepress/commit/4cbfc60a58f7b7ef0d82c6a2b1a48b67ace3d924))

### Features

- copy public dir ([ddc9d51](https://github.com/vuejs/vitepress/commit/ddc9d519c60423e2432c1f3c0ab5b2ccbabd34a6))
- lean builds ([b61e239](https://github.com/vuejs/vitepress/commit/b61e2398fc40be98cd8372834fa3b1e5277c8e1f))
- prefetch in viewport inbound page chunks ([da4852a](https://github.com/vuejs/vitepress/commit/da4852a61bd73a8b46c4971c330f95761237c733))
- use hashed page file names ([a873564](https://github.com/vuejs/vitepress/commit/a8735646e8aae04d7091decc8c4fd54025ceb181))
- use modulepreload links ([0025af1](https://github.com/vuejs/vitepress/commit/0025af12f4ec8e021ea1b7b9d48b0b4025924d83))

### Performance Improvements

- inject script tags for page common chunk imports ([57d900d](https://github.com/vuejs/vitepress/commit/57d900d4b357f15f3dec28e822bd5fd8d100d589))

## 0.1.1 (2020-04-30)

- fix dependency versions

# 0.1.0 (2020-04-30)

### Features

- add markdown processing ([5c47bbb](https://github.com/vuejs/vitepress/commit/5c47bbb4638d7f78ae38fe02732f5b639654c134))
- spa navigation ([21d3cd8](https://github.com/vuejs/vitepress/commit/21d3cd8cbe4102293d2903c3d060764d86a8f785))
- update head tags during dev ([bdbbdd5](https://github.com/vuejs/vitepress/commit/bdbbdd556fe7e3906a5997291ff692cf2b78d632))
- update title & description during dev ([0b9bf27](https://github.com/vuejs/vitepress/commit/0b9bf273ef4f31bf448f7813c50e474b4035b7dc))
