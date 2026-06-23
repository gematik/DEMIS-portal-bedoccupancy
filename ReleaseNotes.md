<img align="right" width="250" height="47" src="./media/Gematik_Logo_Flag.png"/> <br/>      

# Release portal-bedoccupancy

## Release 1.7.3
- Fixed styling errors for different spacings and diversity problems
- Updated @gematik/demis-portal-core-library to 4.2.4

## Release 1.7.2
- Update NGINX-Base-Image to 1.30.0
- Removed @angular/platform-browser-dynamic
- Added correctly configurable logging
- Updated @gematik/demis-portal-core-library to 4.2.2
- Removed feature flag FEATURE_FLAG_PORTAL_PAGE_STRUCTURE
- Removed feature flag FEATURE_FLAG_PORTAL_ERROR_DIALOG_FILTERING

## Release 1.7.1
- Added filtering of validation errors in the dialog after submitting a notification (FEATURE_FLAG_PORTAL_ERROR_DIALOG_FILTERING)
- Updated @gematik/demis-portal-core-library to 3.2.1

## Release 1.7.0
- Added new sidenav from core library (FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV)
- Updated package name to @single-spa-community/angular
- Updated @gematik/demis-portal-core-library to 3.1.0
- Update NGINX-Base-Image to 1.29.7

## Release 1.6.1
- Updated @gematik/demis-portal-core-library to 3.0.9
- Updated @gematik/demis-portal-theme-library to 1.1.2
- Dependency update because of GHSA-g93w-mfhg-p222

## Release 1.6.0
- Updated Angular to v21
- Migrated to standalone components
- Updated @gematik/demis-portal-core-library to 3.0.3
- Added ids to SideStepper
- Removed unused components and code
- Restructured integration test
- Added accessibility statement link
- Removed CPU limit in helm chart
- Removed istio helm chart
- Changed imprint link and add ids in footer (FEATURE_FLAG_FOOTER_LINKS_CORRECTION)

## Release 1.5.8
- Removed data-cy attributes from elements
- Updated @gematik/demis-portal-core-library to 2.3.9
- Fixed vulnerabilities in dependencies
- Removed feature flag NEW_API_ENDPOINTS

## Release 1.5.7
- Changed info icon in formly templates
- Disabled Sandbox for ChromeHeadless browser to run karma tests in CI
- Updated Base Image to 1.29.4-alpine3.23-slim
- Removed FEATURE_FLAG_PORTAL_PASTEBOX
- Fixed Broken Pod Annotations
- Fixed vulnerabilities in dependencies
- Updated @gematik/demis-portal-core-library to 2.3.8
- Integrated form footer from core library

## Release 1.5.6
- Removed FEATURE_FLAG_PORTAL_ERROR_DIALOG

## Release 1.5.4
- Removed FEATURE_FLAG_PORTAL_SUBMIT and FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT
- Switched to SectionHeader from Portal-Core (FEATURE_FLAG_PORTAL_PAGE_STRUCTURE)
- Fixed a bug, where it was not possible to paste 0 via clipboard in number input fields
- Updated ngx-formly to 7.0.0
- Updated @gematik/demis-portal-core-library to 2.3.0
- Updated NGINX-Base-Image to 1.29.3

## Release 1.5.3
- Removed FEATURE_FLAG_PORTAL_REPEAT
- add configmap checksum as annotation to force pod restart on configmap change
- Update @angular-devkit/build-angular to 19.2.17
- Update @gematik/demis-portal-core-library to 2.2.3

## Release 1.5.1
- Fixed a bug, where validation errors where not shown
- Fixed local code generation from API specification
- Upgraded dependencies
- Added test:coverage npm script to run a single test run with coverage report
- Use submit- and spinner-dialog from Portal-Core (FEATURE_FLAG_PORTAL_SUBMIT)

## Release 1.5.0
- Add new API endpoints activated by feature flag FEATURE_FLAG_NEW_API_ENDPOINTS
- Switch to errorDialog from CoreLibrary for submit (FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT)

## Release 1.4.7
- Update to Angular 19 version
- Update Portal-Core Library version

## Release 1.4.6
- Fixed JWT token decoding

## Release 1.4.5
- Updated data model

## Release 1.4.4
- Changed inputs to outline style
- Updated Readme license disclaimer

## Release 1.4.3
- Updated Portal-Core Library version

## Release 1.4.2
- Updated ospo-resources for adding additional notes and disclaimer

## Release 1.4.1
- Add new font and background color

## Release 1.4.0
- First official GitHub-Release
