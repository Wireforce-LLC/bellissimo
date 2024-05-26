vcl 4.1;

backend default {
    .host = "nginx";
    .port = "80";
}

sub vcl_recv { 
    if (req.url ~ "^/api/.*") { return(pass); 
}