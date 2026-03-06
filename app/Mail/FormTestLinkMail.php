<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FormTestLinkMail extends Mailable
{
    use Queueable, SerializesModels;
    public string $token;
    public string $placement;

    /**
     * Create a new message instance.
     */
    public function __construct(string $token, $placement)
    {
        $this->token = $token;
        $this->placement = $placement;
    }

    public function build()
    {
        return $this
            ->subject('Link Akses Pre-Test')
            ->view('emails.email-validation');
    }
}
