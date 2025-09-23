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
            max-width: 50px;
            height: auto;
        }

        .report-title {
            color: rgb(55 65 81);
            font-size: 1.25rem;
            font-weight: bold;
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
                    <img src="{{ public_path('crop.svg') }}" alt="CropTAP Logo" class="logo" />
                </td>
                <td class="w-half" style="text-align: right;">
                    <div class="report-title">CROP RECOMMENDATION</div>
                    <div class="generated-date">Generated on: {{ now()->format('F d, Y') }}</div>
                </td>
            </tr>
        </table>
        <!-- Top Information Bar -->

        <table class="w-full">
            <tr>
                <td class="w-half">
                    <div class="info-section">
                        <h4>Farmer Fullname:</h4>
                        <p style="white-space: nowrap;">{{ $recommendation->farmer->lastname }}, {{ $recommendation->farmer->firstname }} {{ $recommendation->farmer->middlename ? substr($recommendation->farmer->middlename, 0, 1) . '.' : '' }}</p>
                    </div>
                </td>
                <td class="w-half">
                    <div class="info-section">
                        <h4>Farm Address:</h4>
                        <p style="white-space: nowrap;">{{ $recommendation->farm->location->barangay->name ?? 'N/A' }}, {{ $recommendation->farm->location->municipality->name ?? 'N/A' }}, {{ $recommendation->farm->location->province->name ?? 'N/A' }}</p>

                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Soil Analysis and Crop Recommendation -->
    <table class="data-table">
        <tr>
            <th>Soil pH</th>
            <th>Nitrogen</th>
            <th>Phosphorus</th>
            <th>Potassium</th>
            <th>Temperature (°C)</th>
            <th>Rainfall (mm)</th>
            <th>Humidity (%)</th>

        </tr>
        <tr>
            <td>{{ $recommendation->soil->pH }}</td>
            <td>{{ strtoupper($recommendation->soil->nitrogen_level ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->soil->phosphorus_level ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->soil->potassium_level ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->climate->temperature ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->climate->rainfall ?? 'N/A') }}</td>
            <td>{{ strtoupper($recommendation->climate->humidity ?? 'N/A') }}</td>

        </tr>
    </table>

    <table class="data-table">
        <tr>
            <th>Recommended Crop</th>
            <th>Suitability Score</th>
        </tr>
        <tr>
            <td class="highlight-cell">{{ strtoupper($recommendation->crop->name) }}</td>
            <td class="highlight-cell">{{ $recommendation->confidence_score ? number_format($recommendation->confidence_score * 100) . '%' : 'N/A' }}</td>
        </tr>

    </table>

    <!-- Fertilizer Recommendation and Landscape Info -->
    <table class="data-table">
        <tr>
            <th>Variety</th>
            <th style="width: 281px;">Fertilizer Recommendation Rate</th>
            <th>Growth Stage</th>
            <th>Unit</th>
        </tr>
        @if(isset($fertilizer_recommendations['nitrogen']['crop_fertilizer']) && count($fertilizer_recommendations['nitrogen']['crop_fertilizer']) > 0)
            @foreach($fertilizer_recommendations['nitrogen']['crop_fertilizer'] as $index => $fertilizer)
                <tr>
                    <td class="highlight-cell">{{ $fertilizer['crop_name'] ?? 'N/A' }}</td>
                    <td>
                        @php
                        $nRecoAmmount = $fertilizer['nitrogen_rate'] ?? 0;
                        $pRecoAmmount = $fertilizer_recommendations['phosphorus']['crop_fertilizer'][$index]['phosphorus_rate'] ?? 0;
                        $kRecoAmmount = $fertilizer_recommendations['potassium']['crop_fertilizer'][$index]['potassium_rate'] ?? 0;
                        @endphp
                        {{ number_format($nRecoAmmount, 0) }} N - {{ number_format($pRecoAmmount, 0) }} P - {{ number_format($kRecoAmmount, 0) }} K
                    </td>
                    <td>{{ $fertilizer['growth_stage'] ?? 'N/A' }}</td>
                    <td>{{ $fertilizer['unit_of_measure'] ?? '' }}</td>
                </tr>
            @endforeach
        @else
            <tr>
                <td colspan="4" style="text-align: center; color: rgb(107 114 128); font-style: italic;">No fertilizer recommendations available</td>
            </tr>
        @endif
    </table>

    <!-- Additional Recommendations -->
    <div class="section-title">PLANTING RECOMMENDATIONS</div>
    <table class="data-table">
        <tr>
            <th>Planting Season</th>
            <th>Harvesting Period</th>
            <th>Growing Duration</th>
            <th>PH Preference</th>
        </tr>
        <tr>
            <td>{{ $recommendation->crop->planting_season_primary ?? 'All Season' }}</td>
            <td>{{ $recommendation->crop->harvesting_period ?? 'N/A' }}</td>
            <td>{{ $recommendation->crop->growing_duration_days ?? 'Various' }}</td>
            <td>{{ $recommendation->crop->ph_preference ?? 'Various' }}</td>
        </tr>
    </table>
    <table class="data-table">
        <tr>
            <th>Soil Requirement</th>
        </tr>
        <tr>
            <td>{{ $recommendation->crop->soil_requirement ?? 'Various' }}</td>
        </tr>
    </table>

    <!-- Farm Details -->
    <div class="section-title">FARM INFORMATION</div>
    <table class="data-table">
        <tr>
            <th>Farm Name</th>
            <th>Total Area</th>
            <th>Cropping System</th>
            <th>Previous Crops</th>
        </tr>
        <tr>
            <td>{{ $recommendation->farm->name }}</td>
            <td>{{ $recommendation->farm->total_area }} hectares</td>
            <td>{{ $recommendation->farm->cropping_system ?? 'N/A' }}</td>
            <td>{{ $recommendation->farm->prev_crops ?? 'First Planting' }}</td>
        </tr>
    </table>


    <!-- Footer Section -->
    <div class="footer">
        <div><strong>CropTAP - A Crop Recommender System Using Data-Driven Algorithms</strong></div>
        <div>This recommendation is based on scientific analysis of your farm conditions and historical data.</div>
        <div class="generated-date">Report generated on {{ $recommendation->created_at->setTimezone('Asia/Manila')->format('F d, Y g:i A') }}</div>
    </div>
</body>

</html>