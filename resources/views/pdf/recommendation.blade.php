<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Crop Recommendation Report</title>
    <style>
        h4 {
            margin: 0;
        }

        .w-full {
            width: 100%;
        }

        .w-half {
            width: 50%;
        }

        .margin-top {
            margin-top: 1.25rem;
        }

        .header {
            margin-bottom: 1rem;
            border-bottom: 2px solid rgb(75 85 99);
            padding-bottom: 1rem;
        }

        .logo {
            max-width: 120px;
            height: auto;
        }

        .report-title {
            color: rgb(55 65 81);
            font-size: 1.25rem;
            font-weight: bold;
            text-align: center;
        }

        .section-title {
            background-color: rgb(107 114 128);
            color: white;
            padding: 0.5rem;
            font-weight: bold;
            margin-top: 1rem;
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
        }

        .compact-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding: 0.75rem;
            background-color: rgb(249 250 251);
            border: 1px solid rgb(209 213 219);
        }

        .info-section {
            flex: 1;
            margin-right: 1rem;
        }

        .info-section:last-child {
            margin-right: 0;
        }

        .info-section h4 {
            color: rgb(55 65 81);
            font-size: 0.875rem;
            margin: 0 0 0.25rem 0;
            font-weight: bold;
        }

        .info-section p {
            margin: 0;
            font-size: 0.875rem;
            color: rgb(75 85 99);
        }

        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 1rem;
        }

        .info-row {
            display: table-row;
        }

        .info-label {
            display: table-cell;
            font-weight: bold;
            padding: 0.25rem 1rem 0.25rem 0;
            width: 30%;
        }

        .info-value {
            display: table-cell;
            padding: 0.25rem 0;
        }

        .recommendations-table {
            font-size: 0.875rem;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        .recommendations-table th {
            background-color: rgb(107 114 128);
            color: white;
            padding: 0.5rem;
            text-align: center;
            border: 1px solid rgb(107 114 128);
            font-size: 0.875rem;
        }

        .recommendations-table td {
            padding: 0.5rem;
            border: 1px solid rgb(209 213 219);
            text-align: center;
            font-size: 0.875rem;
        }

        .recommendations-table tr:nth-child(even) {
            background-color: rgb(249 250 251);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.5rem 0;
        }

        .data-table th {
            background-color: rgb(107 114 128);
            color: white;
            padding: 0.5rem;
            text-align: center;
            font-size: 0.875rem;
            font-weight: bold;
        }

        .data-table td {
            padding: 0.5rem;
            text-align: center;
            font-size: 0.875rem;
            border: 1px solid rgb(209 213 219);
        }

        .highlight-cell {
            background-color: rgb(243 244 246);
            font-weight: bold;
        }

        .footer {
            font-size: 0.875rem;
            padding: 1rem;
            background-color: rgb(248 250 252);
            border-top: 1px solid rgb(229 231 235);
            margin-top: 2rem;
            text-align: center;
        }

        .generated-date {
            font-style: italic;
            color: rgb(107 114 128);
        }
    </style>
</head>

<body>
    <!-- Header Section -->
    <div class="header">
        <table class="w-full">
            <tr>
                <td class="w-half">
                    <img src="{{ asset('cropTAPLogiICO.ico') }}" alt="CropTAP Logo" class="logo" />
                </td>
                <td class="w-half" style="text-align: right;">
                    <div class="report-title">CROP RECOMMENDATION REPORT</div>
                    <div class="generated-date">Generated on: {{ now()->format('F d, Y') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Top Information Bar -->
    <div class="compact-info">
        <div class="info-section">
            <h4>Farmer Name:</h4>
            <p>{{ $recommendation->farmer->firstname }} {{ $recommendation->farmer->middlename ?? '' }} {{ $recommendation->farmer->lastname }}</p>
        </div>
        <div class="info-section">
            <h4>Recommendation Date:</h4>
            <p>{{ $recommendation->recommendation_date->format('F d, Y') }}</p>
        </div>
        <div class="info-section">
            <h4>Location:</h4>
            <p>
                @if($recommendation->farmer->location)
                    {{ $recommendation->farmer->location->barangay->name ?? '' }}, {{ $recommendation->farmer->location->municipality->name ?? '' }}
                @else
                    {{ $recommendation->farm->location->barangay->name ?? 'N/A' }}
                @endif
            </p>
        </div>
        <div class="info-section">
            <h4>Sample ID:</h4>
            <p>#{{$recommendation->id}}</p>
        </div>
    </div>

    <!-- Soil Analysis and Crop Recommendation -->
    <table class="data-table">
        <tr>
            <th>Soil pH</th>
            <th>Nitrogen</th>
            <th>Phosphorus</th>
            <th>Potassium</th>
            <th>Recommended Crop</th>
        </tr>
        <tr>
            <td>{{ $recommendation->farm->soils->first()->pH ?? 'N/A' }}</td>
            <td>{{ strtoupper($recommendation->farm->soils->first()->nitrogen_level ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->farm->soils->first()->phosphorus_level ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->farm->soils->first()->potassium_level ?? 'N/A') }}</td>
            <td class="highlight-cell">{{ strtoupper($recommendation->crop->name) }}</td>
        </tr>
    </table>

    <!-- Fertilizer Recommendation and Landscape Info -->
    <table class="data-table">
        <tr>
            <th>Fertilizer Recommendation Rate (kg/ha)</th>
            <th>Landscape</th>
        </tr>
        <tr>
            <td>
                @php
                    $nitrogen = $recommendation->farm->soils->first()->nitrogen ?? 0;
                    $phosphorus = $recommendation->farm->soils->first()->phosphorus ?? 0;
                    $potassium = $recommendation->farm->soils->first()->potassium ?? 0;
                @endphp
                {{ number_format($nitrogen, 0) }} - {{ number_format($phosphorus, 0) }} - {{ number_format($potassium, 0) }}
            </td>
            <td>{{ strtoupper($recommendation->farm->location->barangay->name ?? 'HILLYLAND') }}</td>
        </tr>
    </table>

    <!-- Additional Recommendations -->
    <div class="section-title">PLANTING RECOMMENDATIONS</div>
    <table class="data-table">
        <tr>
            <th>Best Planting Season</th>
            <th>Expected Maturity</th>
            <th>Soil Type Suitable</th>
        </tr>
        <tr>
            <td>{{ $recommendation->crop->time_of_planting ?? 'All Season' }}</td>
            <td>{{ $recommendation->crop->maturity ?? 'N/A' }}</td>
            <td>{{ $recommendation->crop->soil_type ?? 'Various' }}</td>
        </tr>
    </table>

    <!-- Farm Details -->
    <div class="section-title">FARM INFORMATION</div>
    <table class="data-table">
        <tr>
            <th>Farm Name</th>
            <th>Total Area</th>
            <th>Previous Crops</th>
        </tr>
        <tr>
            <td>{{ $recommendation->farm->name }}</td>
            <td>{{ $recommendation->farm->total_area }} hectares</td>
            <td>{{ $recommendation->farm->prev_crops ?? 'First Planting' }}</td>
        </tr>
    </table>

    <!-- Footer Section -->
    <div class="footer">
        <div><strong>CropTAP - A Crop Recommender System Using Data-Driven Algorithms</strong></div>
        <div>This recommendation is based on scientific analysis of your farm conditions and historical data.</div>
        <div class="generated-date">Report generated on {{ now()->format('F d, Y \a\t g:i A') }}</div>
    </div>
</body>

</html>
