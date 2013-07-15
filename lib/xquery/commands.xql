declare option output:method 'json';

declare function local:param($param){
   if(not(contains($param, '='))) then () else
   let $parts := tokenize($param, '=')
   
   let $n := replace($parts[1], '\(', '')
   let $values := replace($parts[2], "['\)]", '')
   let $values := replace($values, '\.\.\.', 'string')
   let $values :=  tokenize($values, '\|')
   let $type := if(count($values) > 1) then 'array' else 'string'
  return 
  element {$n} {(
      attribute type {$type}
    , (
        for $v in $values
          return if($type eq 'array') then <value>{$v}</value> else $v
     )
     
  )}
};

<json type="object">

{
  for $def in doc('http://docs.basex.org/wiki/Commands')
//*:td/*:b[matches(text(), '^XML.Syntax$')]/ancestor::*:td/following-sibling::*:td[1]/*:code/text()
     
     let $cmd := replace($def, '^<([^ />]+).*', '$1')
     let $tag := tokenize(normalize-space(replace($def, '^<([^/>]+).*', '$1')), ' ')
     return
     element {$tag[1]} {(
        attribute type {'object'},
       <input-required type="boolean">{ contains($def, '>[input]<') }</input-required>,
       <params type="object">
         <required type="object">
           {
             for $param in $tag[not(starts-with(., '('))]
               return local:param($param)
           }
         </required>
         <optional type="object">
           {
             for $param in $tag[starts-with(., '(')]
               return local:param($param)
           }
         </optional>
       </params>
   )}
     
}
</json>