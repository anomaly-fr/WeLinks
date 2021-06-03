export default function boyerMooreHorspool( haystack, needle, start ) {

    var nlen = needle.length
    var hlen = haystack.length
  
    if( nlen <= 0 || hlen <= 0 )
      return -1
  
    var jump, offset = start || 0
    var scan = 0
    var last = nlen - 1
    var skip = {}
  
    for( scan = 0; scan < last; scan++ ) {
      skip[ needle[ scan ] ] = last - scan
    }
  
    while( hlen >= nlen ) {
      for( scan = last; haystack[ offset + scan ] === needle[ scan ]; scan-- ) {
        if( scan === 0 ) { return offset }
      }
      jump = skip[ haystack[ offset + last ] ]
      jump = jump != null ? jump : nlen
      hlen -= jump
      offset += jump
    }
  
    return -1
  
  }

