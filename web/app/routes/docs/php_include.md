
## Accessing External Files in Folders

To access external files within folders in Bellissimo, you can use relative paths. For instance, if you have a file external.php located in a subfolder named includes, you can include it in your main PHP file as shown below:

```
file_get_contents(__DIR__ . '/any.json')
```