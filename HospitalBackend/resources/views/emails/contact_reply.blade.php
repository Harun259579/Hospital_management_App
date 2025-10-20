@component('mail::message')
# Hello {{ $messageData->name }},

We received your message:
> "{{ $messageData->message }}"

**Our reply:**
{{ $replyText }}

Thanks for contacting us,  
{{ config('app.name') }}
@endcomponent
