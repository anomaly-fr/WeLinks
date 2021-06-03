import qs from 'qs';
import { Linking } from 'react-native';


const sendFeedback = (to, subject, body) => {
  

    let url = `mailto:${to}`;

  
    const query = qs.stringify({
        subject: subject,
        body: body,
        
    });

    if (query.length) {
        url += `?${query}`;
    }

    
    const canOpen = Linking.canOpenURL(url);

    if (!canOpen) {
        console.log('Error sending feedback')
    }

    return Linking.openURL(url);
}

export default sendFeedback;

