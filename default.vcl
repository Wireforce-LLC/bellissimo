vcl 4.1;

sub vcl_recv { 
    if (req.url ~ "^/api/.*") { return(pass); 
}

backend default {
    .host = "nginx";
    .port = "80";
}