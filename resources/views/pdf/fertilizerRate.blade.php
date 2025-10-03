<!doctype html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Fertilizer Rate Recommendation Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }

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
            background-color: rgb(97 145 84);
            color: white;
            padding: 0.5rem;
            font-weight: bold;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
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

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.5rem 0;
        }

        .data-table th {
            background-color: rgb(97 145 84);
            color: white;
            padding: 0.5rem;
            text-align: center;
            font-size: 0.875rem;
            font-weight: bold;
            border: 1px solid rgb(97 145 84);
        }

        .data-table td {
            padding: 0.5rem;
            text-align: center;
            font-size: 0.875rem;
            border: 1px solid rgb(209 213 219);
        }

        .data-table tr:nth-child(even) {
            background-color: rgb(249 250 251);
        }

        .highlight-cell {
            background-color: rgb(243 244 246);
            font-weight: bold;
        }

        .nutrient-card {
            margin-bottom: 1rem;
            border: 1px solid rgb(209 213 219);
            border-radius: 0.5rem;
            overflow: hidden;
        }

        .nutrient-header-n {
            background-color: rgb(34 197 94);
            color: white;
            padding: 0.5rem;
            font-weight: bold;
            font-size: 0.875rem;
        }

        .nutrient-header-p {
            background-color: rgb(59 130 246);
            color: white;
            padding: 0.5rem;
            font-weight: bold;
            font-size: 0.875rem;
        }

        .nutrient-header-k {
            background-color: rgb(249 115 22);
            color: white;
            padding: 0.5rem;
            font-weight: bold;
            font-size: 0.875rem;
        }

        .nutrient-content {
            padding: 0.75rem;
            background-color: white;
        }

        .recommendation-box {
            background-color: rgb(249 250 251);
            border: 1px solid rgb(209 213 219);
            border-radius: 0.25rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .recommendation-box .crop-name {
            font-weight: bold;
            color: rgb(55 65 81);
            margin-bottom: 0.25rem;
        }

        .recommendation-box .rate {
            font-size: 1.1rem;
            font-weight: bold;
            color: rgb(97 145 84);
            margin-top: 0.25rem;
        }

        .recommendation-box .details {
            font-size: 0.75rem;
            color: rgb(107 114 128);
        }

        .fertilizer-calculation {
            background-color: rgb(254 252 232);
            border: 1px solid rgb(250 204 21);
            border-radius: 0.25rem;
            padding: 0.5rem;
            margin-top: 0.5rem;
        }

        .fertilizer-calculation h5 {
            color: rgb(161 98 7);
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
        }

        .fertilizer-calculation .calc-item {
            font-size: 0.75rem;
            color: rgb(120 53 15);
            margin-bottom: 0.15rem;
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

        .no-data {
            text-align: center;
            color: rgb(107 114 128);
            font-style: italic;
            padding: 1rem;
        }

        .summary-table {
            width: 100%;
            margin-top: 1rem;
            border-collapse: collapse;
        }

        .summary-table th {
            background-color: rgb(243 244 246);
            padding: 0.5rem;
            text-align: left;
            font-size: 0.875rem;
            border: 1px solid rgb(209 213 219);
        }

        .summary-table td {
            padding: 0.5rem;
            font-size: 0.875rem;
            border: 1px solid rgb(209 213 219);
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
                    <div class="report-title">FERTILIZER RATE RECOMMENDATION</div>
                    <div class="generated-date">Generated on: {{ now()->format('F d, Y g:i A') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Crop and Soil Information -->
    <div class="section-title">CROP & SOIL INFORMATION</div>
    <table class="summary-table">
        <tr>
            <th style="width: 30%;">Crop Type</th>
            <td>{{ $filters['crop_type'] ?? 'N/A' }}</td>
        </tr>
        @if(!empty($filters['growth_stage']))
        <tr>
            <th>Variety/Growth Stage</th>
            <td>{{ $filters['growth_stage'] }}</td>
        </tr>
        @endif
        @if(!empty($filters['soil_type']))
        <tr>
            <th>Soil Type</th>
            <td>{{ $filters['soil_type'] }}</td>
        </tr>
        @endif
    </table>

    <!-- Nutrient Levels -->
    <div class="section-title">SOIL NUTRIENT LEVELS</div>
    <table class="data-table">
        <tr>
            <th>Nitrogen (N)</th>
            <th>Phosphorus (P)</th>
            <th>Potassium (K)</th>
        </tr>
        <tr>
            <td class="highlight-cell">{{ strtoupper($filters['nitrogen_level'] ?? 'N/A') }}</td>
            <td class="highlight-cell">{{ strtoupper($filters['phosphorus_level'] ?? 'N/A') }}</td>
            <td class="highlight-cell">{{ strtoupper($filters['potassium_level'] ?? 'N/A') }}</td>
        </tr>
    </table>

    <!-- Nitrogen Recommendations -->
    <div class="section-title">NITROGEN (N) RECOMMENDATIONS</div>
    <div class="nutrient-card">
        <div class="nutrient-header-n">
            Nitrogen Level: {{ strtoupper($recommendations['nitrogen']['level'] ?? 'N/A') }}
        </div>
        <div class="nutrient-content">
            @if(isset($recommendations['nitrogen']['crop_fertilizer']) && count($recommendations['nitrogen']['crop_fertilizer']) > 0)
                @foreach($recommendations['nitrogen']['crop_fertilizer'] as $fertilizer)
                    <div class="recommendation-box">
                        <div class="crop-name">{{ $fertilizer['crop_name'] ?? 'N/A' }}</div>
                        @if(!empty($fertilizer['growth_stage']) && $fertilizer['growth_stage'] !== 'N/A')
                            <div class="details">Growth Stage: {{ $fertilizer['growth_stage'] }}</div>
                        @endif
                        @if(!empty($fertilizer['soil_type']) && $fertilizer['soil_type'] !== 'N/A')
                            <div class="details">Soil Type: {{ $fertilizer['soil_type'] }}</div>
                        @endif
                        <div class="rate">{{ $fertilizer['nitrogen_rate'] ?? 0 }} {{ $fertilizer['unit_of_measure'] ?? 'kg/ha' }}</div>

                        @php
                            $nRate = floatval($fertilizer['nitrogen_rate'] ?? 0);
                            // Common nitrogen fertilizer calculations
                            $urea = $nRate > 0 ? round($nRate / 0.46, 2) : 0; // Urea is 46% N
                            $ammoniumSulfate = $nRate > 0 ? round($nRate / 0.21, 2) : 0; // Ammonium sulfate is 21% N
                            $ammoniumNitrate = $nRate > 0 ? round($nRate / 0.34, 2) : 0; // Ammonium nitrate is 34% N
                        @endphp

                        @if($nRate > 0)
                        <div class="fertilizer-calculation">
                            <h5>Fertilizer Product Calculations:</h5>
                            <div class="calc-item">• Urea (46-0-0): <strong>{{ number_format($urea, 2) }} kg/ha</strong></div>
                            <div class="calc-item">• Ammonium Sulfate (21-0-0): <strong>{{ number_format($ammoniumSulfate, 2) }} kg/ha</strong></div>
                            <div class="calc-item">• Ammonium Nitrate (34-0-0): <strong>{{ number_format($ammoniumNitrate, 2) }} kg/ha</strong></div>
                        </div>
                        @endif
                    </div>
                @endforeach
            @else
                <div class="no-data">No nitrogen recommendations available</div>
            @endif
        </div>
    </div>

    <!-- Phosphorus Recommendations -->
    <div class="section-title">PHOSPHORUS (P) RECOMMENDATIONS</div>
    <div class="nutrient-card">
        <div class="nutrient-header-p">
            Phosphorus Level: {{ strtoupper($recommendations['phosphorus']['level'] ?? 'N/A') }}
        </div>
        <div class="nutrient-content">
            @if(isset($recommendations['phosphorus']['crop_fertilizer']) && count($recommendations['phosphorus']['crop_fertilizer']) > 0)
                @foreach($recommendations['phosphorus']['crop_fertilizer'] as $fertilizer)
                    <div class="recommendation-box">
                        <div class="crop-name">{{ $fertilizer['crop_name'] ?? 'N/A' }}</div>
                        @if(!empty($fertilizer['growth_stage']) && $fertilizer['growth_stage'] !== 'N/A')
                            <div class="details">Growth Stage: {{ $fertilizer['growth_stage'] }}</div>
                        @endif
                        @if(!empty($fertilizer['soil_type']) && $fertilizer['soil_type'] !== 'N/A')
                            <div class="details">Soil Type: {{ $fertilizer['soil_type'] }}</div>
                        @endif
                        <div class="rate">{{ $fertilizer['phosphorus_rate'] ?? 0 }} {{ $fertilizer['unit_of_measure'] ?? 'kg/ha' }}</div>

                        @php
                            $pRate = floatval($fertilizer['phosphorus_rate'] ?? 0);
                            // Common phosphorus fertilizer calculations
                            $ssp = $pRate > 0 ? round($pRate / 0.18, 2) : 0; // Single superphosphate is 18% P2O5
                            $tsp = $pRate > 0 ? round($pRate / 0.46, 2) : 0; // Triple superphosphate is 46% P2O5
                            $dap = $pRate > 0 ? round($pRate / 0.46, 2) : 0; // DAP is 46% P2O5 (also contains 18% N)
                        @endphp

                        @if($pRate > 0)
                        <div class="fertilizer-calculation">
                            <h5>Fertilizer Product Calculations:</h5>
                            <div class="calc-item">• Single Superphosphate (0-18-0): <strong>{{ number_format($ssp, 2) }} kg/ha</strong></div>
                            <div class="calc-item">• Triple Superphosphate (0-46-0): <strong>{{ number_format($tsp, 2) }} kg/ha</strong></div>
                            <div class="calc-item">• DAP (18-46-0): <strong>{{ number_format($dap, 2) }} kg/ha</strong> (also provides {{ number_format($dap * 0.18, 2) }} kg/ha N)</div>
                        </div>
                        @endif
                    </div>
                @endforeach
            @else
                <div class="no-data">No phosphorus recommendations available</div>
            @endif
        </div>
    </div>

    <!-- Potassium Recommendations -->
    <div class="section-title">POTASSIUM (K) RECOMMENDATIONS</div>
    <div class="nutrient-card">
        <div class="nutrient-header-k">
            Potassium Level: {{ strtoupper($recommendations['potassium']['level'] ?? 'N/A') }}
        </div>
        <div class="nutrient-content">
            @if(isset($recommendations['potassium']['crop_fertilizer']) && count($recommendations['potassium']['crop_fertilizer']) > 0)
                @foreach($recommendations['potassium']['crop_fertilizer'] as $fertilizer)
                    <div class="recommendation-box">
                        <div class="crop-name">{{ $fertilizer['crop_name'] ?? 'N/A' }}</div>
                        @if(!empty($fertilizer['growth_stage']) && $fertilizer['growth_stage'] !== 'N/A')
                            <div class="details">Growth Stage: {{ $fertilizer['growth_stage'] }}</div>
                        @endif
                        @if(!empty($fertilizer['soil_type']) && $fertilizer['soil_type'] !== 'N/A')
                            <div class="details">Soil Type: {{ $fertilizer['soil_type'] }}</div>
                        @endif
                        <div class="rate">{{ $fertilizer['potassium_rate'] ?? 0 }} {{ $fertilizer['unit_of_measure'] ?? 'kg/ha' }}</div>

                        @php
                            $kRate = floatval($fertilizer['potassium_rate'] ?? 0);
                            // Common potassium fertilizer calculations
                            $mop = $kRate > 0 ? round($kRate / 0.60, 2) : 0; // Muriate of Potash (KCl) is 60% K2O
                            $sop = $kRate > 0 ? round($kRate / 0.50, 2) : 0; // Sulfate of Potash is 50% K2O
                        @endphp

                        @if($kRate > 0)
                        <div class="fertilizer-calculation">
                            <h5>Fertilizer Product Calculations:</h5>
                            <div class="calc-item">• Muriate of Potash (0-0-60): <strong>{{ number_format($mop, 2) }} kg/ha</strong></div>
                            <div class="calc-item">• Sulfate of Potash (0-0-50): <strong>{{ number_format($sop, 2) }} kg/ha</strong></div>
                        </div>
                        @endif
                    </div>
                @endforeach
            @else
                <div class="no-data">No potassium recommendations available</div>
            @endif
        </div>
    </div>

    <!-- Application Notes -->
    <div class="section-title">APPLICATION NOTES</div>
    <div style="padding: 0.75rem; background-color: rgb(254 252 232); border: 1px solid rgb(250 204 21); border-radius: 0.25rem; margin-bottom: 1rem;">
        <p style="font-size: 0.875rem; color: rgb(120 53 15); margin-bottom: 0.5rem;">
            <strong>Important:</strong> The fertilizer calculations above are based on the nutrient content of common fertilizer products.
        </p>
        <ul style="font-size: 0.875rem; color: rgb(120 53 15); margin-left: 1.5rem;">
            <li>Always verify the actual NPK content on your fertilizer product label</li>
            <li>Apply fertilizers based on soil test results and crop growth stage</li>
            <li>Split applications may be recommended for better nutrient uptake</li>
            <li>Consider organic matter content and previous crop history</li>
            <li>Consult with an agricultural extension officer for specific recommendations</li>
        </ul>
    </div>

    <!-- Footer Section -->
    <div class="footer">
        <div><strong>CropTAP - A Crop Recommender System Using Data-Driven Algorithms</strong></div>
        <div>This fertilizer rate recommendation is based on scientific analysis of soil nutrient levels and crop requirements.</div>
        <div class="generated-date">Report generated on {{ now()->setTimezone('Asia/Manila')->format('F d, Y g:i A') }}</div>
    </div>
</body>

</html>
