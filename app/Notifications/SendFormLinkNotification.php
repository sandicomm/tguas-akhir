<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendFormLinkNotification extends Notification
{
    use Queueable;

    protected $token;
    protected $placement;

    /**
     * Create a new notification instance.
     */
    public function __construct($token, $placement)
    {
        $this->token = $token;
        $this->placement = $placement;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Buat URL verifikasi
        $url = route('form-test.verify', [
            'token' => $this->token,
            'placement' => $this->placement,
        ]);

        return (new MailMessage)
            ->subject('Akses Validasi Email - ' . ucfirst($this->placement))
            ->greeting('Halo 👋')
            ->line('Silakan klik tombol di bawah ini untuk melakukan validasi email dan memulai ' . $this->placement . '.')
            ->action('Mulai ' . ucfirst($this->placement), $url)
            ->line('Link ini hanya berlaku selama 30 menit.')
            ->line('Jika Anda tidak merasa meminta link ini, abaikan saja email ini.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
