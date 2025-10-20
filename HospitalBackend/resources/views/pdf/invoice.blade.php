<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $bill->id }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h2 { margin-bottom: 5px; }
        .info { margin-bottom: 20px; }
        .info p { margin: 4px 0; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background: #f4f4f4; }
        .total { text-align: right; margin-top: 20px; font-size: 18px; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="header">
        <h2> Hospital Billing Invoice</h2>
        <p><strong>Invoice ID:</strong> #{{ $bill->id }}</p>
        <p><strong>Date:</strong> {{ $bill->created_at->format('d M Y') }}</p>
    </div>

    <div class="info">
        <p><strong>Patient Name:</strong> {{ $bill->patient->user->name }}</p>
        <p><strong>Email:</strong> {{ $bill->patient->user->email }}</p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Medical Bill</td>
                <td>{{ ucfirst($bill->status) }}</td>
                <td>${{ number_format($bill->amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="total">
        <strong>Total Due: ${{ number_format($bill->amount, 2) }}</strong>
    </div>

    <div class="footer">
        <p>Thank you for visiting our hospital. Get well soon ❤️</p>
    </div>
</body>
</html>
