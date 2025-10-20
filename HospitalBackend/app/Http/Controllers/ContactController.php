<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    // 📨 1️⃣ Store contact message
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($request->all());

        return response()->json(['message' => 'Thank you for contacting us!'], 201);
    }

    // 🧾 2️⃣ Show all messages (optional for admin panel)
    public function index()
    {
        $messages = ContactMessage::latest()->paginate(20);
        return response()->json($messages);
    }

    // 🗑️ 3️⃣ Delete message by ID
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }

    // ✉️ 4️⃣ Reply to a message by sending email
    public function reply(Request $request, $id)
    {
        $request->validate([
            'reply_message' => 'required|string',
        ]);

        $contact = ContactMessage::findOrFail($id);

        // Mail পাঠানো
        Mail::raw($request->reply_message, function ($mail) use ($contact) {
            $mail->to($contact->email)
                 ->subject('Reply from Our Support Team');
        });

        return response()->json(['message' => 'Reply sent successfully']);
    }
}
