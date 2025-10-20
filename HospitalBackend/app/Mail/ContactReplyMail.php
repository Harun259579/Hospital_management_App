<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ContactMessage;

class ContactReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageData;
    public $replyText;

    public function __construct(ContactMessage $messageData, $replyText)
    {
        $this->messageData = $messageData;
        $this->replyText = $replyText;
    }

    public function build()
    {
        return $this->subject('Reply to your message')
                    ->markdown('emails.contact_reply');
    }
}
