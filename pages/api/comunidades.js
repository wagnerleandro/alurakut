import { SiteClient } from 'datocms-client'

export default async function datoCms(req, res) {

    if (req.method === 'POST') {

        const TOKEN = '8087f664b08ff8d2460bc12d569894';

        const client = new SiteClient(TOKEN);

        const record = await client.items.create({
            itemType: "1132710",
            ...req.body

        })

        console.log(record);

        res.json({
            record: 'Registros',
            created: record,
        })
        return;
    }
}