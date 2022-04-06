import * as express from 'express';
import { registerPartials } from 'hbs';

const app: any = express();

app.use('/static', express.static(`${__dirname}/../static`));
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/../views`);
registerPartials(`${__dirname}/../views/partials`);

app.get('/', (req: any, res: any) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('running!');
});