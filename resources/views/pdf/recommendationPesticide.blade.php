<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Pesticide Information</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #222;
            font-size: 13px;
        }
        h1, h2 {
            text-align: center;
            color: #357f25;
            margin-top: 0;
        }
        .pesticide-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .pesticide-table th,
        .pesticide-table td {
            border: 1px solid #acd18d;
            padding: 7px;
            text-align: left;
        }
        .pesticide-table th {
            background-color: #e9f6df;
            color: #356319;
            font-weight: bold;
        }
        .meta {
            margin-bottom: 12px;
        }
        .meta strong {
            width: 140px;
            display: inline-block;
            color: #246e11;
        }
        .section-title {
            color: #366f19;
            margin-bottom: 8px;
            margin-top: 20px;
            border-bottom: 1px solid #ceeaab;
            padding-bottom: 3px;
        }
    </style>
</head>
<body>
    <h1>Pesticide Data Sheet</h1>
    @isset($pesticide)
            <h2>{{ $pesticide->product_name }}</h2>
            <div class="meta">
                <strong>Company:</strong> {{ $pesticide->company }}<br>
                <strong>Active Ingredient:</strong> {{ $pesticide->active_ingredient }}<br>
                <strong>Product Name:</strong> {{ $pesticide->product_name }}<br>
                <strong>Registration #:</strong> {{ $pesticide->registration_number }}<br>
                <strong>Expiry Date:</strong> {{ $pesticide->expiry_date }}<br>
            </div>
            <table class="pesticide-table">
                <tr>
                    <th>Concentration</th>
                    <td>{{ $pesticide->concentration }}</td>
                </tr>
                <tr>
                    <th>Formulation</th>
                    <td>{{ $pesticide->formulation_type }}</td>
                </tr>
                <tr>
                    <th>Uses</th>
                    <td>{{ $pesticide->uses }}</td>
                </tr>
                <tr>
                    <th>Toxicity Category</th>
                    <td>{{ $pesticide->toxicity_category }}</td>
                </tr>
                <tr>
                    <th>Mode of Entry</th>
                    <td>{{ $pesticide->mode_of_entry }}</td>
                </tr>
                <tr>
                    <th>Recommended Rate</th>
                    <td>{{ $pesticide->recommended_rate }}</td>
                </tr>
                <tr>
                    <th>MRL</th>
                    <td>{{ $pesticide->MRL }}</td>
                </tr>
                <tr>
                    <th>PHI</th>
                    <td>{{ $pesticide->PHI }}</td>
                </tr>
                <tr>
                    <th>Re-Entry Period</th>
                    <td>{{ $pesticide->re_entry_period }}</td>
                </tr>
                <tr>
                    <th>Crops</th>
                    <td>{{ $pesticide->crops }}</td>
                </tr>
                <tr>
                    <th>Pests</th>
                    <td>{{ $pesticide->pests }}</td>
                </tr>
                <tr>
                    <th>Weeds</th>
                    <td>{{ $pesticide->weeds }}</td>
                </tr>
                <tr>
                    <th>Diseases</th>
                    <td>{{ $pesticide->diseases }}</td>
                </tr>
            </table>
        <p>No pesticide data available.</p>
    @endisset
</body>
</html>
