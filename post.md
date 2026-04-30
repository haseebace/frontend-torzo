POST 1: The "Sick of the BS" vibe
Subreddit ideas: r/Piracy, r/selfhosted

Title: Tired of dodging 50 fake download buttons just to find one magnet link? Yeah, me too.

Body:
Yo, is it just me or have the big torrent indexers become absolute malware graveyards lately? I got so fed up with the ad-gore and sketchy popups that I decided to just build my own search tool.

I call it Torzo (https://torzo.vercel.app/). It’s basically a super clean, minimal search bar that pulls results from different providers without a single ad in sight. I also hooked up Real-Debrid integration, so you can connect your account (the key stays strictly in your own browser) and get a high-speed direct link instantly.

It’s still in early alpha, so be gentle if it breaks. Give it a look at https://torzo.vercel.app/ and let me know if you think it’s actually useful or if I’m just wasting my time.

POST 2: The "Real-Debrid Workflow" fix
Subreddit ideas: r/RealDebrid, r/debrid

Title: Made a little tool to skip the "copy-paste to RD" dance.

Body:
I love Real-Debrid, but I hate the workflow of finding a magnet on some dodgy site, dodging ads, and then manually pasting the link into my RD dashboard.

I tossed together https://torzo.vercel.app/ to fix that. It lets you search multiple spots in one tab and "unrestrict" the link right there in the UI. No accounts, no tracking, and no ads. Your API key lives in your browser's local storage—I never see it and it never touches my server.

If you’re an RD user and want something snappier, check it out: https://torzo.vercel.app/

POST 3: The "Minimalist/Design" angle
Subreddit ideas: r/SideProject, r/InternetIsBeautiful

Title: Built a torrent search engine that actually looks like it belongs in 2026.

Body:
Most torrent sites look like they were designed in a basement in 2005 and then buried under a mountain of gambling ads. I wanted something that felt clean and modern, so I built https://torzo.vercel.app/

It’s a zero-fluff search aggregator for magnets. No banners, no popups, no noise. Just find your file and go. It’s got Real-Debrid support built-in for direct downloads too.

I've got a lot of plans for this (more providers, better filtering), but it’s already my daily driver. Have a look: https://torzo.vercel.app/

POST 4: The "Dev sharing a toy" vibe
Subreddit ideas: r/nextjs, r/WebDev

Title: Weekend project: A live magnet search aggregator with zero ads.

Body:
Wanted to share a little project I’ve been tinkering with: https://torzo.vercel.app/

I was annoyed by the state of torrent indexing sites, so I built a "clean room" version using Next.js. It hits a live upstream API, so results are always fresh. The cool part is the Real-Debrid integration—I built a proxy so users can securely connect their accounts via localStorage to get direct HTTP links without any CORS headaches.

Check it out if you’re bored, and I’d love to hear what you think about the UI: https://torzo.vercel.app/

POST 5: The "Help me break this" angle
Subreddit ideas: r/Alphatest, r/Piracy

Title: Built an ad-free search tool for magnets and I need some "guinea pigs" to test it.

Body:
I’m building https://torzo.vercel.app/ because the big index sites are honestly getting unusable with the amount of ads they’re cramming in.

It’s a super lightweight UI that lets you search and convert magnets to direct links using Real-Debrid. I’ve tried to make it as "no-nonsense" as possible.

If you guys could take it for a spin and see if it actually finds what you’re looking for (or if you can find a way to break it), I’d really appreciate the feedback.

Link: https://torzo.vercel.app/

POST 6: The "Straight to the point" hater
Subreddit ideas: r/Piracy

Title: Why is every torrent site a malware minefield?

Body:
Seriously, I just want to find one file without my browser screaming at me. I got so annoyed that I spent the last few weeks building this: https://torzo.vercel.app/

It’s ad-free, popup-free, and you can pick exactly which providers you want to search. If you use Real-Debrid, you can hook it up for instant direct downloads.

Hope this helps some of you who are as done with the "dodgy" web as I am.

POST 7: The "What's next?" vibe
Subreddit ideas: r/selfhosted, r/debrid

Title: Tinkering with a new way to search and download. What do you think?

Body:
Hey all, I’ve been working on a project called Torzo (https://torzo.vercel.app/). Right now, it’s a very clean search aggregator for magnets with RD support.

My goal is to make it the only tool you need to find and convert files without ever seeing a single annoying ad. It’s all very lightweight and privacy-focused—no accounts needed, everything stays in your browser.

What features would make this a "must-have" for you? You can play with the current version here: https://torzo.vercel.app/

POST 8: The "Mobile User" struggle
Subreddit ideas: r/RealDebrid, r/Piracy

Title: Finally, a torrent search tool that doesn't suck on mobile.

Body:
Trying to find a magnet link on your phone is usually a nightmare of popups and redirects. I got tired of it, so I built https://torzo.vercel.app/

It’s a super clean search engine that works like a charm on mobile. You can search RARBG, TPB, and YTS in one go. If you use Real-Debrid, you can hit one button to get your direct download link. Fast, clean, and actually works.

Give it a try: https://torzo.vercel.app/

POST 9: The "I hate accounts" angle
Subreddit ideas: r/InternetIsBeautiful

Title: A search tool that doesn't want your data or show you junk.

Body:
I built https://torzo.vercel.app/ with a "zero tracking" mindset. No user accounts, no analytics, and definitely no ads. Your settings and API keys stay only in your browser.

It’s just a clean way to find what you need and get direct download links if you use Real-Debrid. I’m just trying to make the web a little less gross.

Let me know what you think: https://torzo.vercel.app/

POST 10: The "Just sharing" vibe
Subreddit ideas: r/Anywhere

Title: I made a thing: Torzo - The ad-free magnet search engine.

Body:
Just a little side project I’ve been working on to escape the ad-heavy torrent sites.

- Super clean UI
- Real-Debrid support (Direct Downloads)
- Choose your providers (RARBG, TPB, YTS)
- Zero popups.

Try it out if you’re looking for something better: https://torzo.vercel.app/

You're 100% right to call me out on that—I got my words totally mixed up while replying to the other comment. My bad To be crystal clear: The key is NOT stored on my server/database. It lives only in your browser's LocalStorage.The 'POST' request you're seeing is a pass-through (a proxy). I had to add it because Real-Debrid blocks direct calls from browsers (CORS issues). So the key hits my server for half a second just to talk to RD and then it's gone. I don't log it, I don't save it. I'm a solo dev just trying to make this work, so thanks for keeping me honest. I'll update the main post to be more accurate!
