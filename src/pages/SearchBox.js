import { SearchBox } from '@mapbox/search-js-react';

const MyComponent = () => {
  return (
    <div>
    <SearchBox
      accessToken='pk.eyJ1IjoidGhoYXUxNTAzIiwiYSI6ImNtM2g2ZWs0ODBja3Yyam9pcngzMmJrZmMifQ.FlzJ-DIlnxugqc_eJjjzUQ'
      options={{
        language: 'vi',
        country: 'VN'
      }}
    />
    </div>
  )
}

export default MyComponent
