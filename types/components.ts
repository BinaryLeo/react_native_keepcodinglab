export interface TicketCardProps {
    ticketnumber: number;
    details: {
        title: string; //Information from user Input
        description: string; //Information from user Input
        attachment: string; //Information from user Input
    }
    status: 'Open' | 'Closed'; //Default value = 'Open'
    priority: 'Low' | 'Medium' | 'High' | ''; //Default value = ''
    createdBy: string; //Default value = ''
    created: string; //Default value = new Date().toISOString()
    updated: string; //Default value = ''
}