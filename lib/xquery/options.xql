declare option output:method 'json';
<json type="object">
{
  for $def in doc("http://docs.basex.org/wiki/Options")
    //*:td/*:b[matches(text(), '^Signature$')]/ancestor::*:td/following-sibling::*:td[1]/*:code/text()
     
     let $name := lower-case(replace($def, '^([A-Z0-9]+).*', '$1'))
     let $type := if(ends-with($def, ']')) 
       then replace($def, '.*\[([^\]]+)\]$', '$1') 
       else ()
     return
     element {$name} {$type}
     
}
</json>