import React from 'react';
import Separate from 'components/common/Separate';
import 'styles/components/common/article.less';

const Article = ({ data, wrapperClass }) => {
  const {
    content = '',
    creater = '',
    title = '',
    publishTime = '',
    files = [],
  } = data;

  return (
    <div className={`article ${wrapperClass}`}>
      <h3 className="title">{title}</h3>
      <div className="desc">
        <span>{creater}</span>
        <Separate isVertical={false} />
        <span>{publishTime ? publishTime.slice(0, 16) : ''}</span>
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      { (files && files.length)
        ? <div className="clearfix file">
            <div className="pull-left">附件：</div>
            <div className="pull-left">
              {
                files.map(i => {
                  const { resourceId, fileName } = i;
                  const href = resourceId && fileName
                    ? `/system/infoFile.resource?resourceId=${i.resourceId}&fileName=${i.fileName}`
                    : 'javascript:;';
                  return (
                    <div>
                      <a href={href}>{i.fileName}</a>
                    </div>
                  );
                })
              }
            </div>
          </div>
        : null
      }
    </div>
  );
};

export default Article;
