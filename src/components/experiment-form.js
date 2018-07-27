// import React, { Component } from 'react';

// import Button from '@material-ui/core/Button';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardContent';
// import CardContent from '@material-ui/core/CardContent';
// import Typography from '@material-ui/core/Typography';

// import { required} from '../utils/formValidation';
// import { handleInputChange, createFields_ } from '../utils/formGenerator';

// class ExperimentForm extends Component {

//   fileUpload;
//   handleInputChange;
//   createFields;

//   constructor(props) {
//     super(props);
//     this.state = {};
//     this.state.fields = {
//       'dateTime' : {
//         label: 'Start date',
//         type: 'date',
//         value: (new Date()).toISOString().slice(0,10),
//         error: '',
//         validate: [required]
//       },
//       'id' : {
//         label: 'Experiment ID',
//         type: 'text',
//         value: '',
//         error: '',
//         validate: [required]
//       },
//       'deviceId' : {
//         label: 'Device ID',
//         type: 'text',
//         value: '',
//         error: ''
//       },
//       'motivation': {
//         label: 'Motivation',
//         type: 'text',
//         value: '',
//         error: '',
//         validate: [required]
//       },
//       'file' : {
//         label: 'Upload file',
//         type: 'file',
//         value: '',
//         error: '',
//         validate: [required]
//       },
//       'expDesign': {
//         label: 'Experimental design',
//         type: 'textarea',
//         value: '',
//         error: '',
//         validate: [required]
//       },
//       'expNotes': {
//         label: 'Experimental notes',
//         type: 'textarea',
//         value: '',
//         error: '',
//       },
//       'dataNotes': {
//         label: 'Data notes',
//         type: 'textarea',
//         value: '',
//         error: '',
//       },
//       'results': {
//         label: 'Results',
//         type: 'textarea',
//         value: '',
//         error: '',
//         validate: [required]
//       },
//       'hasAux' : {
//         label: 'Has aux',
//         type: 'checkbox',
//         value: false,
//         error: ''
//       },
//       'hasSpecial' : {
//         label: 'Has special',
//         type: 'checkbox',
//         value: false,
//         error: ''
//       }
//     }

//     this.handleInputChange = handleInputChange.bind(this);
//     this.createFields = createFields_.bind(this);
//   }

//   render() {
//     let formFields = this.createFields();

//     return (
//       <div>
//         <Card elevation={1}>
//           <CardContent>
//             <Typography variant="headline">New Experiment</Typography>
//             <br/>
//             <form>
//             {formFields}
//             </form>
//           </CardContent>
//           <CardActions >
//             <Button variant="contained" color="secondary" >
//               Upload
//             </Button>
//           </CardActions>
//         </Card>
//       </div>
//     )
//   }

// }

// export default ExperimentForm;
