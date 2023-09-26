import {ThreeDots} from 'react-loader-spinner';

export default function Loader() {
    return(
        <ThreeDots 
            height="80" 
        width="80" 
        color="#4fa94d" 
        radius="9"
        wrapperStyle={{}}
        ariaLabel="three-dots-loading"
        visible={true}
        wrapperClassName=""
        />
    )
}