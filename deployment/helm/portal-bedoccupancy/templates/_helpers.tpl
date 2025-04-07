{{/*
Expand the name of the chart.
*/}}
{{- define "portal-bedoccupancy.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "portal-bedoccupancy.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "portal-bedoccupancy.fullversionname" -}}
{{- if .Values.istio.enable }}
{{- $name := include "portal-bedoccupancy.fullname" . }}
{{- $version := regexReplaceAll "\\.+" .Chart.Version "-" }}
{{- printf "%s-%s" $name $version | trunc 63 }}
{{- else }}
{{- include "portal-bedoccupancy.fullname" . }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "portal-bedoccupancy.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "portal-bedoccupancy.labels" -}}
helm.sh/chart: {{ include "portal-bedoccupancy.chart" . }}
{{ include "portal-bedoccupancy.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- with .Values.customLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "portal-bedoccupancy.selectorLabels" -}}
{{ if .Values.istio.enable -}}
app: {{ include "portal-bedoccupancy.name" . }}
version: {{ .Chart.AppVersion | quote }}
{{ end -}}
app.kubernetes.io/name: {{ include "portal-bedoccupancy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Deployment labels
*/}}
{{- define "portal-bedoccupancy.deploymentLabels" -}}
{{- with .Values.deploymentLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}


{{/*
Create the name of the service account to use
*/}}
{{- define "portal-bedoccupancy.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "portal-bedoccupancy.fullversionname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
